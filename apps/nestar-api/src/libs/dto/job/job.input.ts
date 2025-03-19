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

	@IsOptional()
	@Field(() => KoreanLevel, { nullable: true })
	koreanLevel?: KoreanLevel;

	@IsOptional()
	@Field(() => WorkplaceTypes, { nullable: true })
	workplaceType: WorkplaceTypes;

	@IsOptional()
	@Field(() => JobSorts, { nullable: true })
	jobSort: JobSorts;

	@IsOptional()
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
	@Field(() => [JobType], { nullable: 'itemsAndList' })
	jobType?: JobType[];

	@IsOptional()
	@Field(() => [JobLocation], { nullable: 'itemsAndList' })
	locationList?: JobLocation[];

	@IsOptional()
	@Field(() => SalaryRange, { nullable: true })
	salaryRange?: SalaryRange;

	@IsOptional()
	@Field(() => [KoreanLevel], { nullable: true })
	koreanLevel?: KoreanLevel[];

	@IsOptional()
	@Field(() => [WorkplaceTypes], { nullable: true })
	workplaceType?: WorkplaceTypes[];

	@IsOptional()
	@Field(() => [JobSorts], { nullable: true })
	sortList?: JobSorts[];

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	jobVisa?: boolean;

	@IsOptional()
	@Field(() => [JobTags], { nullable: 'itemsAndList' })
	jobTags?: JobTags[];

	@IsOptional()
	@Field(() => [JobExperience], { nullable: true })
	jobExperience?: JobExperience[];

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
export class AJISearch {
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
	@Field(() => AJISearch)
	search: AJISearch;
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
