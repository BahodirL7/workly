import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { JobModule } from './job/job.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { MarkModule } from './mark/mark.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		JobModule,
		BoardArticleModule,
		MarkModule,
		ViewModule,
		CommentModule,
		FollowModule,
	],
})
export class ComponentsModule {}
