import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
	USER = 'USER',
	COMPANY = 'COMPANY',
	ADMIN = 'ADMIN',
}
registerEnumType(MemberType, { name: 'MemberType' });

export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	BLOCK = 'BLOCK',
	DELETE = 'DELETE',
}
registerEnumType(MemberStatus, { name: 'MemberStatus' });

export enum MemberAuthType {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL',
	TELEGRAM = 'TELEGRAM',
}
registerEnumType(MemberAuthType, { name: 'MemberAuthType' });

export enum EmployeeCapacity {
	SOLO = '1-10',
	SMALL = '11-50',
	MEDIUM = '51-200',
	LARGE = '201-500',
	ENTERPRISE = '501-1000',
	CORPORATE = '1001+',
}
registerEnumType(EmployeeCapacity, { name: 'EmployeeCapacity' });
