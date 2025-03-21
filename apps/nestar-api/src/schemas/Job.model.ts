import { Schema } from 'mongoose';
import {
	JobLocation,
	JobStatus,
	JobType,
	KoreanLevel,
	WorkplaceTypes,
	JobSorts,
	JobTags,
	JobExperience,
} from '../libs/enums/job.enum';

const JobSchema = new Schema(
	{
		jobType: {
			type: String,
			enum: JobType,
			required: true,
		},

		jobStatus: {
			type: String,
			enum: JobStatus,
			default: JobStatus.HIRING,
		},

		jobLocation: {
			type: String,
			enum: JobLocation,
			required: true,
		},

		jobAddress: {
			type: String,
			required: true,
		},

		jobTitle: {
			type: String,
			required: true,
		},

		jobSalary: {
			type: Number,
			default: 0,
		},

		koreanLevel: {
			type: String,
			enum: KoreanLevel,
			required: true,
		},

		workplaceType: {
			type: String,
			enum: WorkplaceTypes,
			required: true,
		},

		jobSort: {
			type: String,
			enum: JobSorts,
			required: true,
		},

		jobViews: {
			type: Number,
			default: 0,
		},

		jobMarks: {
			type: Number,
			default: 0,
		},

		jobComments: {
			type: Number,
			default: 0,
		},

		jobImages: {
			type: [String],
			required: true,
		},

		jobDesc: {
			type: String,
		},

		jobVisa: {
			type: Boolean,
			default: false,
		},

		jobTags: {
			type: [String],
			enum: JobTags,
		},

		jobExperience: {
			type: String,
			enum: JobExperience,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		closedAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},

		postedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'jobs' },
);

JobSchema.index({ jobType: 1, jobLocation: 1, jobTitle: 1 }, { unique: true });

export default JobSchema;
