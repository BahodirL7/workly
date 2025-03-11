import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Jobs, Job } from '../../libs/dto/job/job';
import { AgentJobsInquiry, AllJobsInquiry, OrdinaryInquiry, JobsInquiry, JobInput } from '../../libs/dto/job/job.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { StatisticModifier, T } from '../../libs/types/common';
import { JobStatus } from '../../libs/enums/job.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';
import { JobUpdate } from '../../libs/dto/job/job.update';
import * as moment from 'moment';
import { lookupAuthMemberMarked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { MarkInput } from '../../libs/dto/mark/mark.input';
import { MarkGroup } from '../../libs/enums/mark.enum';
import { MarkService } from '../mark/mark.service';

@Injectable()
export class JobService {
	constructor(
		@InjectModel('Job') private readonly jobModel: Model<Job>,
		private readonly memberService: MemberService,
		private readonly viewService: ViewService,
		private readonly markService: MarkService,
	) {}

	public async createJob(input: JobInput): Promise<Job> {
		try {
			const result = await this.jobModel.create(input);
			//increase MemberJobs
			await this.memberService.memberStatsEditor({ _id: result.memberId, targetKey: 'memberJobs', modifier: 1 });
			console.log('result;', result);

			result.memberData = await this.memberService.getMember(null, result.memberId);

			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getJob(memberId: ObjectId, jobId: ObjectId): Promise<Job> {
		const search: T = { _id: jobId, jobStatus: JobStatus.HIRING };

		const targetJob: Job = await this.jobModel.findOne(search).exec();
		if (!targetJob) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: jobId, viewGroup: ViewGroup.JOB };
			const newView = await this.viewService.recordView(viewInput);

			if (newView) {
				await this.jobStatsEditor({ _id: jobId, targetKey: 'jobViews', modifier: 1 });
				targetJob.jobViews++;
			}

			//meMarked
			const markInput = { memberId: memberId, markRefId: jobId, markGroup: MarkGroup.JOB };
			targetJob.meMarked = await this.markService.checkMarkExistence(markInput);
		}

		targetJob.memberData = await this.memberService.getMember(null, targetJob.memberId);
		return targetJob;
	}

	public async jobStatsEditor(input: StatisticModifier): Promise<Job> {
		const { _id, targetKey, modifier } = input;
		return await this.jobModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}

	public async updateJob(memberId: ObjectId, input: JobUpdate): Promise<Job> {
		let { jobStatus, closedAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			memberId: memberId,
			jobStatus: JobStatus.HIRING,
		};

		if (jobStatus === JobStatus.CLOSED) closedAt = moment().toDate();
		else if (jobStatus === JobStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.jobModel.findOneAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (closedAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberJobs',
				modifier: -1,
			});
		}

		return result;
	}

	public async getJobs(memberId: ObjectId, input: JobsInquiry): Promise<Jobs> {
		const match: T = { jobStatus: JobStatus.HIRING };

		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('match:', match);

		const result = await this.jobModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthMemberMarked(memberId),
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	private shapeMatchQuery(match: T, input: JobsInquiry): void {
		const { memberId, locationList, jobCategory, workplaceTypes, typeList, pricesRange, options, text } = input.search;

		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
		if (locationList && locationList.length) match.jobLocation = { $in: locationList };
		if (jobCategory && jobCategory.length) match.jobCategory = { $in: jobCategory };
		if (workplaceTypes && workplaceTypes.length) match.workplaceTypes = { $in: workplaceTypes };
		if (typeList && typeList.length) match.jobType = { $in: typeList };

		if (pricesRange) match.jobSalary = { $gte: pricesRange.start, $lte: pricesRange.end };
		// if (periodsRange) match.createdAt = { $gte: periodsRange.start, $lte: periodsRange.end };
		// if (squaresRange) match.propertySquare = { $gte: squaresRange.start, $lte: squaresRange.end };

		if (text) match.propertyTitle = { $regex: new RegExp(text, 'i') };
		if (options) {
			match['$or'] = options.map((ele) => {
				return { [ele]: true };
			});
		}
	}

	public async getAgentJobs(memberId: ObjectId, input: AgentJobsInquiry): Promise<Jobs> {
		const { jobStatus } = input.search;
		if (jobStatus === JobStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);
		const match: T = { memberId: memberId, jobStatus: jobStatus ?? { $ne: JobStatus.DELETE } };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.jobModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Jobs> {
		return await this.markService.getFavoriteJobs(memberId, input);
	}

	public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Jobs> {
		return await this.viewService.getVisitedJobs(memberId, input);
	}

	public async markTargetJob(memberId: ObjectId, markRefId: ObjectId): Promise<Job> {
		const target: Job = await this.jobModel.findOne({ _id: markRefId, jobStatus: JobStatus.HIRING }).exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		const input: MarkInput = { memberId: memberId, markRefId: markRefId, markGroup: MarkGroup.JOB };

		// MARK TOGGLE via Mark modules
		const modifier: number = await this.markService.toggleMark(input);
		const result = await this.jobStatsEditor({ _id: markRefId, targetKey: 'jobMarks', modifier: modifier });

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	/** ADMIN **/

	public async getAllJobsByAdmin(input: AllJobsInquiry): Promise<Jobs> {
		const { jobStatus, jobLocationList } = input.search;
		const match: T = {};
		const sort: T = { [input.sort ?? 'createdAt']: input.direction ?? Direction.DESC };

		if (jobStatus) match.jobStatus = jobStatus;
		if (jobLocationList) match.jobLocation = { $in: jobLocationList };

		const result = await this.jobModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateJobByAdmin(input: JobUpdate): Promise<Job> {
		let { jobStatus, closedAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			propertyStatus: JobStatus.HIRING,
		};

		if (jobStatus === JobStatus.CLOSED) closedAt = moment().toDate();
		else if (jobStatus === JobStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.jobModel.findOneAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (closedAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberJobs',
				modifier: -1,
			});
		}

		return result;
	}

	public async removeJobByAdmin(propertyId: ObjectId): Promise<Job> {
		const search: T = { _id: propertyId, propertyStatus: JobStatus.DELETE };
		const result = await this.jobModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}
