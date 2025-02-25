import { Module } from '@nestjs/common';
import { MarkService } from './mark.service';
import { MongooseModule } from '@nestjs/mongoose';
import MarkSchema from '../../schemas/Mark.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Mark', schema: MarkSchema }])],
	providers: [MarkService],
	exports: [MarkService],
})
export class MarkModule {}
