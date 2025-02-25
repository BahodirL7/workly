import { Schema } from 'mongoose';
import { ViewGroup } from '../libs/enums/view.enum';

const MarkSchema = new Schema(
	{
		markGroup: {
			type: String,
			enum: ViewGroup,
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

MarkSchema.index({ memberId: 1, markRefId: 1 }, { unique: true });

export default MarkSchema;
