import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { JobService } from './job.service';
import { Jobs, Job } from '../../libs/dto/job/job';
import { AgentJobsInquiry, AllJobsInquiry, OrdinaryInquiry, JobsInquiry, JobInput } from '../../libs/dto/job/job.input';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { JobUpdate } from '../../libs/dto/job/job.update';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class JobResolver {
	constructor(private readonly jobService: JobService) {}

	@Roles(MemberType.COMPANY)
	@UseGuards(RolesGuard)
	@Mutation(() => Job)
	public async createJob(@Args('input') input: JobInput, @AuthMember('_id') memberId: ObjectId): Promise<Job> {
		console.log('Mutation: createProperty');
		input.memberId = memberId;
		return await this.jobService.createJob(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Job)
	public async getJob(@Args('jobId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Job> {
		console.log('Query: getJob');
		const jobId = shapeIntoMongoObjectId(input);
		return await this.jobService.getJob(memberId, jobId);
	}

	@Roles(MemberType.COMPANY)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Job)
	public async updateJob(@Args('input') input: JobUpdate, @AuthMember('_id') memberId: ObjectId): Promise<Job> {
		console.log('Mutation: updateJob');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.jobService.updateJob(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Jobs)
	public async getJobs(@Args('input') input: JobsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Jobs> {
		console.log('Query: getJobs');
		return await this.jobService.getJobs(memberId, input);
	}

	@Roles(MemberType.COMPANY)
	@UseGuards(RolesGuard)
	@Query((returns) => Jobs)
	public async getAgentJobs(
		@Args('input') input: AgentJobsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Jobs> {
		console.log('Query: getAgentJobs');
		return await this.jobService.getAgentJobs(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Job)
	public async markTargetJob(@Args('jobId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Job> {
		console.log('Mutation: markTargetJob');
		const markRefId = shapeIntoMongoObjectId(input);
		return await this.jobService.markTargetJob(memberId, markRefId);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Jobs)
	public async getFavorites(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Jobs> {
		console.log('Query: getFavorites');
		return await this.jobService.getFavorites(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Jobs)
	public async getVisited(@Args('input') input: OrdinaryInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Jobs> {
		console.log('Query: getVisited');
		return await this.jobService.getVisited(memberId, input);
	}

	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Jobs)
	public async getAllJobsByAdmin(
		@Args('input') input: AllJobsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Jobs> {
		console.log('Query: getAllJobsByAdmin');
		return await this.jobService.getAllJobsByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Job)
	public async updateJobByAdmin(@Args('input') input: JobUpdate): Promise<Job> {
		console.log('Mutation: updateJobByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.jobService.updateJobByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Job)
	public async removeJobByAdmin(@Args('jobId') input: string): Promise<Job> {
		console.log('Mutation: removeJobByAdmin');
		const jobId = shapeIntoMongoObjectId(input);
		return await this.jobService.removeJobByAdmin(jobId);
	}
}
