import { Field, ObjectType } from '@nestjs/graphql';
import { MarkGroup } from '../../enums/mark.enum';
import { ObjectId } from 'mongoose';

@ObjectType()
export class MeMarked {
	@Field(() => String)
	memberId: ObjectId;

	@Field(() => String)
	markRefId: ObjectId;

	@Field(() => Boolean)
	myFavorite: boolean;
}

@ObjectType()
export class Mark {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => MarkGroup)
	markGroup: MarkGroup;

	@Field(() => String)
	markRefId: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
