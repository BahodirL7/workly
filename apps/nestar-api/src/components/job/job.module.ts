import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import JobSchema from '../../schemas/Job.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { JobResolver } from './job.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberModule } from '../member/member.module';
import { MarkModule } from '../mark/mark.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
		AuthModule,
		ViewModule,
		MemberModule,
		MarkModule,
	],

	providers: [JobResolver, JobService],
	exports: [JobService],
})
export class JobModule {}
