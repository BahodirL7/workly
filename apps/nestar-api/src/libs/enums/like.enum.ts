import { registerEnumType } from '@nestjs/graphql';

export enum MarkGroup {
	MEMBER = 'MEMBER',
	JOB = 'JOB',
	ARTICLE = 'ARTICLE',
}
registerEnumType(MarkGroup, {
	name: 'MarkGroup',
});
