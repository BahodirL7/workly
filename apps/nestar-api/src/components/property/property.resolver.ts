import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { PropertyService } from './property.service';
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
export class PropertyResolver {
	constructor(private readonly propertyService: PropertyService) {}

	@Roles(MemberType.COMPANY)
	@UseGuards(RolesGuard)
	@Mutation(() => Job)
	public async createProperty(@Args('input') input: JobInput, @AuthMember('_id') memberId: ObjectId): Promise<Job> {
		console.log('Mutation: createProperty');
		input.memberId = memberId;
		return await this.propertyService.createProperty(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Job)
	public async getProperty(@Args('propertyId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Job> {
		console.log('Query: getProperty');
		const propertyId = shapeIntoMongoObjectId(input);
		return await this.propertyService.getProperty(memberId, propertyId);
	}

	@Roles(MemberType.COMPANY)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Job)
	public async updateProperty(@Args('input') input: JobUpdate, @AuthMember('_id') memberId: ObjectId): Promise<Job> {
		console.log('Mutation: updateProperty');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.propertyService.updateProperty(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Jobs)
	public async getProperties(@Args('input') input: JobsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Jobs> {
		console.log('Query: getProperties');
		return await this.propertyService.getProperties(memberId, input);
	}

	@Roles(MemberType.COMPANY)
	@UseGuards(RolesGuard)
	@Query((returns) => Jobs)
	public async getAgentProperties(
		@Args('input') input: AgentJobsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Jobs> {
		console.log('Query: getAgentProperties');
		return await this.propertyService.getAgentProperties(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Job)
	public async likeTargetProperty(
		@Args('propertyId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Job> {
		console.log('Mutation: likeTargetProperty');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.propertyService.likeTargetProperty(memberId, likeRefId);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Jobs)
	public async getFavorites(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Jobs> {
		console.log('Query: getFavorites');
		return await this.propertyService.getFavorites(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Jobs)
	public async getVisited(@Args('input') input: OrdinaryInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Jobs> {
		console.log('Query: getVisited');
		return await this.propertyService.getVisited(memberId, input);
	}

	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Jobs)
	public async getAllPropertiesByAdmin(
		@Args('input') input: AllJobsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Jobs> {
		console.log('Query: getAllPropertiesByAdmin');
		return await this.propertyService.getAllPropertiesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Job)
	public async updatePropertyByAdmin(@Args('input') input: JobUpdate): Promise<Job> {
		console.log('Mutation: updatePropertyByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.propertyService.updatePropertyByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Job)
	public async removePropertyByAdmin(@Args('propertyId') input: string): Promise<Job> {
		console.log('Mutation: removePropertyByAdmin');
		const jobId = shapeIntoMongoObjectId(input);
		return await this.propertyService.removePropertyByAdmin(jobId);
	}
}
