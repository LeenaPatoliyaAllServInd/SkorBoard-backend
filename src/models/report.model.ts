import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import Base from './utils/Generic.model';

@Entity()
class Report extends Base {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', {
		nullable: true,
		default: null,
	})
	name: string;

	@Column('text', {
		nullable: true,
		default: null,
	})
	description: string;

	@Column()
	userId: number;
}

export default Report;
