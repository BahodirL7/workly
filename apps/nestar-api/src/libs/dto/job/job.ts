import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import {
	JobExperience,
	JobLocation,
	JobSorts,
	JobStatus,
	JobTags,
	JobType,
	KoreanLevel,
	WorkplaceTypes,
} from '../../enums/job.enum';
import { Member, TotalCounter } from '../member/member';
import { MeMarked } from '../mark/mark';

@ObjectType()
export class Job {
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

	@Field(() => Int, { nullable: true })
	jobSalary?: number;

	@Field(() => KoreanLevel)
	koreanLevel: KoreanLevel;

	@Field(() => WorkplaceTypes, { nullable: true })
	workplaceType?: WorkplaceTypes;

	@Field(() => JobSorts, { nullable: true })
	jobSort?: JobSorts;

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

	@Field(() => JobExperience)
	jobExperience: JobExperience;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	closedAt?: Date;

	@Field(() => Date, { nullable: true })
	createdAt: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	postedAt?: Date;

	@Field(() => Date, { nullable: true })
	updatedAt: Date;

	/** from aggregation **/

	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => [MeMarked], { nullable: true })
	meMarked?: MeMarked[];
}

@ObjectType()
export class Jobs {
	@Field(() => [Job])
	list: Job[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
