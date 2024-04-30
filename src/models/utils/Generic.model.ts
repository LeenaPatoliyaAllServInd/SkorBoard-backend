import { STATUS } from '@constants/config.constant';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
class Base extends BaseEntity {
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({ type: 'enum', enum: STATUS, default: 1 })
	status: Number;

	@Column({ type: 'boolean', default: false })
	isDeleted: Boolean;
}

export default Base;
