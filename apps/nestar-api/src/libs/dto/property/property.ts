import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import {
	JobLocation,
	JobSorts,
	JobStatus,
	JobTags,
	JobType,
	KoreanLevel,
	WorkplaceTypes,
} from '../../enums/property.enum';
import { Member, TotalCounter } from '../member/member';
import { MeMarked } from '../like/like';

@ObjectType()
export class Property {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => JobType)
	jobType: JobType;

	@Field(() => JobStatus)
	jobStatus: JobStatus;

	@Field(() => JobLocation)
	jobLocation: JobLocation;

	@Field(() => String)
	jobAddress: string;

	@Field(() => String)
	jobTitle: string;

	@Field(() => Number)
	jobSalary: number;

	@Field(() => KoreanLevel)
	koreanLevel: KoreanLevel;

	@Field(() => WorkplaceTypes)
	workplaceTypes: WorkplaceTypes;

	@Field(() => JobSorts)
	jobCategory: JobSorts;

	@Field(() => Int)
	jobViews: number;

	@Field(() => Int)
	jobMarks: number;

	@Field(() => Int)
	jobComments: number;

	@Field(() => [String])
	jobImages: string[];

	@Field(() => String, { nullable: true })
	jobDesc?: string[];

	@Field(() => Boolean)
	jobVisa: boolean;

	@Field(() => [JobTags])
	jobTags: JobTags[];

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	closedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	postedAt?: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/

	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => [MeMarked], { nullable: true })
	meMarked?: MeMarked[];
}

@ObjectType()
export class Properties {
	@Field(() => [Property])
	list: Property[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
