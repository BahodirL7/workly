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
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { MarkInput } from '../../libs/dto/mark/job.input';
import { MarkGroup } from '../../libs/enums/mark.enum';
import { LikeService } from '../like/like.service';

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Job>,
		private readonly memberService: MemberService,
		private readonly viewService: ViewService,
		private readonly likeService: LikeService,
	) {}

	public async createProperty(input: JobInput): Promise<Job> {
		try {
			const result = await this.propertyModel.create(input);
			//increase MemberProperties
			await this.memberService.memberStatsEditor({ _id: result.memberId, targetKey: 'memberProperties', modifier: 1 });
			console.log('result;', result);
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getProperty(memberId: ObjectId, propertyId: ObjectId): Promise<Job> {
		const search: T = { _id: propertyId, propertyStatus: JobStatus.HIRING };

		const targetProperty: Job = await this.propertyModel.findOne(search).exec();
		if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: propertyId, viewGroup: ViewGroup.JOB };
			const newView = await this.viewService.recordView(viewInput);

			if (newView) {
				await this.propertyStatsEditor({ _id: propertyId, targetKey: 'jobViews', modifier: 1 });
				targetProperty.jobViews++;
			}

			//meLiked
			const markInput = { memberId: memberId, markRefId: propertyId, markGroup: MarkGroup.JOB };
			targetProperty.meMarked = await this.likeService.checkLikeExistence(markInput);
		}

		targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
		return targetProperty;
	}

	public async propertyStatsEditor(input: StatisticModifier): Promise<Job> {
		const { _id, targetKey, modifier } = input;
		return await this.propertyModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}

	public async updateProperty(memberId: ObjectId, input: JobUpdate): Promise<Job> {
		let { jobStatus, closedAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			memberId: memberId,
			propertyStatus: JobStatus.HIRING,
		};

		if (jobStatus === JobStatus.CLOSED) closedAt = moment().toDate();
		else if (jobStatus === JobStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.propertyModel.findOneAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (closedAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberProperties',
				modifier: -1,
			});
		}

		return result;
	}

	public async getProperties(memberId: ObjectId, input: JobsInquiry): Promise<Jobs> {
		const match: T = { propertyStatus: JobStatus.HIRING };

		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('match:', match);

		const result = await this.propertyModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthMemberLiked(memberId),
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

	public async getAgentProperties(memberId: ObjectId, input: AgentJobsInquiry): Promise<Jobs> {
		const { jobStatus } = input.search;
		if (jobStatus === JobStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);
		const match: T = { memberId: memberId, jobStatus: jobStatus ?? { $ne: JobStatus.DELETE } };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.propertyModel
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
		return await this.likeService.getFavoriteProperties(memberId, input);
	}

	public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Jobs> {
		return await this.viewService.getVisitedProperties(memberId, input);
	}

	public async likeTargetProperty(memberId: ObjectId, markRefId: ObjectId): Promise<Job> {
		const target: Job = await this.propertyModel.findOne({ _id: markRefId, jobStatus: JobStatus.HIRING }).exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		const input: MarkInput = { memberId: memberId, markRefId: markRefId, markGroup: MarkGroup.JOB };

		// LIKE TOGGLE via Like modules
		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.propertyStatsEditor({ _id: markRefId, targetKey: 'jobMarks', modifier: modifier });

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	/** ADMIN **/

	public async getAllPropertiesByAdmin(input: AllJobsInquiry): Promise<Jobs> {
		const { jobStatus, jobLocationList } = input.search;
		const match: T = {};
		const sort: T = { [input.sort ?? 'createdAt']: input.direction ?? Direction.DESC };

		if (jobStatus) match.jobStatus = jobStatus;
		if (jobLocationList) match.jobLocation = { $in: jobLocationList };

		const result = await this.propertyModel
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

	public async updatePropertyByAdmin(input: JobUpdate): Promise<Job> {
		let { jobStatus, closedAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			propertyStatus: JobStatus.HIRING,
		};

		if (jobStatus === JobStatus.CLOSED) closedAt = moment().toDate();
		else if (jobStatus === JobStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.propertyModel.findOneAndUpdate(search, input, { new: true }).exec();
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

	public async removePropertyByAdmin(propertyId: ObjectId): Promise<Job> {
		const search: T = { _id: propertyId, propertyStatus: JobStatus.DELETE };
		const result = await this.propertyModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}
