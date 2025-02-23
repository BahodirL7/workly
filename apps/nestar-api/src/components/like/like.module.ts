import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { MongooseModule } from '@nestjs/mongoose';
import LikeSchema from '../../schemas/Mark.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }])],
	providers: [LikeService],
	exports: [LikeService],
})
export class LikeModule {}
