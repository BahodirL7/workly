import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import {
	JobLocation,
	JobSorts,
	JobStatus,
	JobTags,
	JobType,
	KoreanLevel,
	WorkplaceTypes,
} from '../../enums/property.enum';
import { ObjectId } from 'mongoose';
import { availableOptions, availablePropertySorts } from '../../config';
import { Direction } from '../../enums/common.enum';

@InputType()
export class PropertyInput {
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

	@IsNotEmpty()
	@Field(() => Number)
	jobSalary: number;

	@IsNotEmpty()
	@Field(() => KoreanLevel)
	koreanLevel: KoreanLevel;

	@IsNotEmpty()
	@Field(() => WorkplaceTypes)
	workplaceTypes: WorkplaceTypes;

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

// @InputType()
// export class SquareRange {
// 	@Field(() => Int)
// 	start: number;

// 	@Field(() => Int)
// 	end: number;
// }

// @InputType()
// export class PeriodsRange {
// 	@Field(() => Date)
// 	start: Date;

// 	@Field(() => Date)
// 	end: Date;
// }

@InputType()
export class PISearch {
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

	// @IsOptional()
	// @Field(() => PeriodsRange, { nullable: true })
	// periodsRange?: PeriodsRange;

	// @IsOptional()
	// @Field(() => SquareRange, { nullable: true })
	// squaresRange?: SquareRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class PropertiesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePropertySorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch;
}

@InputType()
export class APISearch {
	@IsOptional()
	@Field(() => JobStatus, { nullable: true })
	jobStatus?: JobStatus;
}

@InputType()
export class AgentPropertiesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePropertySorts)
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
export class ALPISearch {
	@IsOptional()
	@Field(() => JobStatus, { nullable: true })
	jobStatus?: JobStatus;

	@IsOptional()
	@Field(() => [JobLocation], { nullable: true })
	jobLocationList?: JobLocation;
}

@InputType()
export class AllPropertiesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePropertySorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALPISearch)
	search: ALPISearch;
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
