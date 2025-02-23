import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { JobLocation, JobSorts, JobStatus, JobTags, JobType, KoreanLevel, WorkplaceTypes } from '../../enums/job.enum';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';

@InputType()
export class JobUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => JobType, { nullable: true })
	jobType?: JobType;

	@IsOptional()
	@Field(() => JobStatus, { nullable: true })
	jobStatus?: JobStatus;

	@IsOptional()
	@Field(() => JobLocation, { nullable: true })
	jobLocation?: JobLocation;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	jobAddress?: string;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	jobTitle?: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	jobSalary?: number;

	@IsOptional()
	@Field(() => KoreanLevel, { nullable: true })
	koreanLevel?: KoreanLevel;

	@IsOptional()
	@Field(() => WorkplaceTypes, { nullable: true })
	workplaceTypes?: WorkplaceTypes;

	@IsOptional()
	@Field(() => JobSorts, { nullable: true })
	jobCategory?: JobSorts;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	jobImages?: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	jobDesc?: string[];

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	jobVisa?: boolean;

	@IsOptional()
	@Field(() => [JobTags], { nullable: true })
	jobTags?: JobTags[];

	closedAt?: Date;

	deletedAt?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	postedAt?: Date;
}
