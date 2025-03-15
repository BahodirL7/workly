import { Schema } from 'mongoose';
import { MarkGroup } from '../libs/enums/mark.enum';

const MarkSchema = new Schema(
	{
		markGroup: {
			type: String,
			enum: MarkGroup,
			required: true,
		},

		markRefId: {
			type: Schema.Types.ObjectId,
			required: true,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'marks' },
);

MarkSchema.index({ memberId: 1, markRefId: 1 }, { unique: true, sparse: true });

export default MarkSchema;
