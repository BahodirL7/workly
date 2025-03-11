import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
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
import { ObjectId } from 'mongoose';
import { availableOptions, availableJobSorts } from '../../config';
import { Direction } from '../../enums/common.enum';

@InputType()
export class JobInput {
	@IsNotEmpty()
	@Field(() => JobType)
	jobType: JobType;

	@IsNotEmpty()
	@Field(() => JobLocation)
	jobLocation: JobLocation;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	jobAddress: string;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	jobTitle: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	jobSalary?: number;

	@IsNotEmpty()
	@Field(() => KoreanLevel)
	koreanLevel: KoreanLevel;

	@IsNotEmpty()
	@Field(() => WorkplaceTypes)
	workplaceType: WorkplaceTypes;

	@IsNotEmpty()
	@Field(() => JobSorts)
	jobCategory: JobSorts;

	@IsNotEmpty()
	@Field(() => [String])
	jobImages: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	jobDesc?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	jobVisa?: boolean;

	@IsOptional()
	@Field(() => [JobTags], { nullable: true })
	jobTags?: JobTags[];
	memberId?: ObjectId;

	@IsNotEmpty()
	@Field(() => JobExperience)
	jobExperience: JobExperience;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	postedAt?: Date;
}

@InputType()
export class SalaryRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class JISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [JobLocation], { nullable: true })
	locationList?: JobLocation[];

	@IsOptional()
	@Field(() => [JobType], { nullable: true })
	typeList?: JobType[];

	@IsOptional()
	@Field(() => JobSorts, { nullable: true })
	jobCategory?: JobSorts;

	@IsOptional()
	@Field(() => WorkplaceTypes, { nullable: true })
	workplaceTypes?: WorkplaceTypes;

	@IsOptional()
	@IsIn(availableOptions, { each: true })
	@Field(() => [String], { nullable: true })
	options?: string[];

	@IsOptional()
	@Field(() => SalaryRange, { nullable: true })
	pricesRange?: SalaryRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class JobsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableJobSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => JISearch)
	search: JISearch;
}

@InputType()
export class APISearch {
	@IsOptional()
	@Field(() => JobStatus, { nullable: true })
	jobStatus?: JobStatus;
}

@InputType()
export class AgentJobsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableJobSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => APISearch)
	search: APISearch;
}

@InputType()
export class ALJISearch {
	@IsOptional()
	@Field(() => JobStatus, { nullable: true })
	jobStatus?: JobStatus;

	@IsOptional()
	@Field(() => [JobLocation], { nullable: true })
	jobLocationList?: JobLocation;
}

@InputType()
export class AllJobsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableJobSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALJISearch)
	search: ALJISearch;
}

@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
