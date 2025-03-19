import { registerEnumType } from '@nestjs/graphql';

export enum JobType {
	FULLTIME = 'FULLTIME',
	PARTTIME = 'PARTTIME',
	CONTRACT = 'CONTRACT',
	INTERNSHIP = 'INTERNSHIP',
}
registerEnumType(JobType, {
	name: 'JobType',
});

export enum JobStatus {
	HIRING = 'HIRING',
	CLOSED = 'CLOSED',
	DELETE = 'DELETE',
}
registerEnumType(JobStatus, {
	name: 'JobStatus',
});

export enum JobLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}
registerEnumType(JobLocation, {
	name: 'JobLocation',
});

export enum KoreanLevel {
	NOTREQUIRED = 'NOTREQUIRED',
	BASIC = 'BASIC',
	CONVERSATIONAL = 'CONVERSATIONAL',
	BUSINESS = 'BUSINESS',
	FLUENT = 'FLUENT',
}
registerEnumType(KoreanLevel, {
	name: 'KoreanLevel',
});

export enum WorkplaceTypes {
	ONSITE = 'ONSITE',
	HYBRID = 'HYBRID',
	REMOTE = 'REMOTE',
}
registerEnumType(WorkplaceTypes, {
	name: 'WorkplaceTypes',
});

export enum JobSorts {
	ENGINEERING = 'ENGINEERING',
	DESIGN = 'DESIGN',
	PRODUCT = 'PRODUCT',
}
registerEnumType(JobSorts, {
	name: 'JobSorts',
});

export enum JobExperience {
	ENTRY_LEVEL = 'ENTRY_LEVEL',
	JUNIOR = 'JUNIOR',
	MID_LEVEL = 'MID_LEVEL',
	SENIOR = 'SENIOR',
	EXPERT = 'EXPERT',
}
registerEnumType(JobExperience, {
	name: 'JobExperience',
});

export enum JobTags {
	ANALYTICS = 'ANALYTICS',
	ANDROID = 'ANDROID',
	ANGULAR = 'ANGULAR',
	BACKEND = 'BACKEND',
	BLOCKCHAIN = 'BLOCKCHAIN',
	C = 'C',
	C_SHARP = 'C#',
	C_PLUS_PLUS = 'C++',
	CSS = 'CSS',
	CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
	DATA_ANALYSIS = 'DATA_ANALYSIS',
	DATA_ENGINEERING = 'DATA_ENGINEERING',
	DATA_MANAGEMENT = 'DATA_MANAGEMENT',
	DEVOPS = 'DEVOPS',
	ELIXIR = 'ELIXIR',
	EMBEDDED_SYSTEM = 'EMBEDDED_SYSTEM',
	ENGINEERING_MANAGEMENT = 'ENGINEERING_MANAGEMENT',
	FLUTTER = 'FLUTTER',
	FRONTEND = 'FRONTEND',
	FULL_STACK = 'FULL_STACK',
	GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
	GO = 'GO',
	GRAPHIC_DESIGN = 'GRAPHIC_DESIGN',
	HTML = 'HTML',
	INFRASTRUCTURE = 'INFRASTRUCTURE',
	IOS = 'IOS',
	IOT = 'IOT',
	JAVA = 'JAVA',
	JAVASCRIPT = 'JAVASCRIPT',
	KOTLIN = 'KOTLIN',
	MACHINE_LEARNING = 'MACHINE_LEARNING',
	MECHANICAL_ENGINEERING = 'MECHANICAL_ENGINEERING',
	NETWORK = 'NETWORK',
	NO_SQL = 'NO_SQL',
	NODE_JS = 'NODE_JS',
	PHP = 'PHP',
	PROJECT_MANAGEMENT = 'PROJECT_MANAGEMENT',
	PYTHON = 'PYTHON',
	QA = 'QA',
	REACT = 'REACT',
	REACT_NATIVE = 'REACT_NATIVE',
	TYPESCRIPT = 'TYPESCRIPT',
}
registerEnumType(JobTags, {
	name: 'JobTags',
});
