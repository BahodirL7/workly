import { registerEnumType } from '@nestjs/graphql';

export enum JobType {
	FULLTIME = 'Full-time',
	PARTTIME = 'Part-time',
	CONTRACT = 'Contract',
	INTERNSHIP = 'Internship',
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
	NOTREQUIRED = 'Not Required',
	BASIC = 'Basic',
	CONVERSATIONAL = 'Conversational',
	BUSINESS = 'Business',
	FLUENT = 'Fluent',
}
registerEnumType(KoreanLevel, {
	name: 'KoreanLevel',
});

export enum WorkplaceTypes {
	ONSITE = 'On-site',
	HYBRID = 'Hybrid',
	REMOTE = 'Remote',
}
registerEnumType(WorkplaceTypes, {
	name: 'WorkplaceTypes',
});

export enum JobSorts {
	ENGINEERING = 'Engineering',
	DESIGN = 'Design',
	PRODUCT = 'Product',
}
registerEnumType(JobSorts, {
	name: 'JobSorts',
});

export enum JobTags {
	ANALYTICS = 'Analytics',
	ANDROID = 'Android',
	ANGULAR = 'Angular',
	BACKEND = 'Back-end',
	BLOCKCHAIN = 'Blockchain',
	C = 'C',
	C_SHARP = 'C#',
	C_PLUS_PLUS = 'C++',
	CSS = 'CSS',
	CUSTOMER_SUPPORT = 'Customer Support',
	DATA_ANALYSIS = 'Data Analysis',
	DATA_ENGINEERING = 'Data Engineering',
	DATA_MANAGEMENT = 'Data Management',
	DEVOPS = 'DevOps',
	ELIXIR = 'Elixir',
	EMBEDDED_SYSTEM = 'Embedded System',
	ENGINEERING_MANAGEMENT = 'Engineering Management',
	FLUTTER = 'Flutter',
	FRONTEND = 'Front-end',
	FULL_STACK = 'Full Stack',
	GAME_DEVELOPMENT = 'Game Development',
	GO = 'Go',
	GRAPHIC_DESIGN = 'Graphic Design',
	HTML = 'HTML',
	INFRASTRUCTURE = 'Infrastructure',
	IOS = 'iOS',
	IOT = 'IoT',
	JAVA = 'Java',
	JAVASCRIPT = 'Javascript',
	KOTLIN = 'Kotlin',
	MACHINE_LEARNING = 'Machine Learning',
	MECHANICAL_ENGINEERING = 'Mechanical Engineering',
	NETWORK = 'Network',
	NO_SQL = 'No-SQL',
	NODE_JS = 'Node.js',
	PHP = 'PHP',
	PROJECT_MANAGEMENT = 'Project Management',
	PYTHON = 'Python',
	QA = 'QA',
	REACT = 'React',
	REACT_NATIVE = 'React Native',
}
registerEnumType(JobTags, {
	name: 'JobTags',
});
