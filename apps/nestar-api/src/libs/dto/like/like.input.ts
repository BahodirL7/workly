import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
import { MarkGroup } from '../../enums/like.enum';

@InputType()
export class MarkInput {
	@IsNotEmpty()
	@Field(() => String)
	memberId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	markRefId: ObjectId;

	@IsNotEmpty()
	@Field(() => MarkGroup)
	markGroup: MarkGroup;
}
