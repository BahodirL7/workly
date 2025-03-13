import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Mark, MeMarked } from '../../libs/dto/mark/mark';
import { MarkInput } from '../../libs/dto/mark/mark.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { OrdinaryInquiry } from '../../libs/dto/job/job.input';
import { Jobs } from '../../libs/dto/job/job';
import { MarkGroup } from '../../libs/enums/mark.enum';
import { lookupFavorite } from '../../libs/config';

@Injectable()
export class MarkService {
	constructor(@InjectModel('Mark') private readonly markModel: Model<Mark>) {}

	public async toggleMark(input: MarkInput): Promise<number> {
		const search: T = { memberId: input.memberId, markRefId: input.markRefId };
		const existing = await this.markModel.findOne(search).exec();
		let modifier: number;

		if (existing) {
			await this.markModel.findOneAndDelete(search).exec();
			modifier = -1; // Unlike
		} else {
			try {
				await this.markModel.findOneAndUpdate(search, input, { upsert: true, setDefaultsOnInsert: true }).exec();
				modifier = 1; // Like
			} catch (err) {
				console.error('Error, Service.model', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}

		console.log(`- Mark modifier ${modifier} -`);
		return modifier;
	}

	public async checkMarkExistence(input: MarkInput): Promise<MeMarked[]> {
		const { memberId, markRefId } = input;
		const result = await this.markModel.findOne({ memberId: memberId, markRefId: markRefId }).exec();

		return result ? [{ memberId: memberId, markRefId: markRefId, myFavorite: true }] : [];
	}
	public async getFavoriteJobs(memberId: ObjectId, input: OrdinaryInquiry): Promise<Jobs> {
		const { page, limit } = input;
		const match: T = { markGroup: MarkGroup.JOB, memberId: memberId };
		const data: T = await this.markModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'jobs',
						localField: 'markRefId',
						foreignField: '_id',
						as: 'favoriteJob',
					},
				},
				{ $unwind: '$favoriteJob' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoriteJob.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		const result: Jobs = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoriteJob);
		console.log('result:', result);
		return result;
	}
}
