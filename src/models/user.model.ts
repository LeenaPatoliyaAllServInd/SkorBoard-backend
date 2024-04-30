import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import crypto from 'crypto';
import { LOGIN_WITH } from '@constants/config.constant';
import Base from './utils/Generic.model';

@Entity()
class User extends Base {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', {
		nullable: true,
		default: null,
	})
	first_name: string;

	@Column('varchar', {
		nullable: true,
		default: null,
	})
	last_name: string;

	@Column('varchar', {
		unique: true,
	})
	email: string;

	@Column('varchar', {
		nullable: true,
		default: null,
	})
	token: string;
	
	@Column('varchar', {
		nullable: true,
		default: null,
	})
	refresh_token: string;

	@Column('varchar', {
		nullable: true,
		default: null,
	})
	password: string;

	@Column('varchar', {
		nullable: true,
		default: null,
	})
	care_sms_user_id: string;

	@Column({
		type: 'enum',
		enum: LOGIN_WITH,
		nullable: true,
	})
	logged_in_with: number;

	@Column({ default: false })
	is_care_sms_user: boolean;

	@Column({ default: true })
	has_skorboard_access: boolean;

	@Column({ nullable: true, default: null })
	billing_address: string;

	@Column({ nullable: true, default: null })
	city: string;

	@Column({ nullable: true, default: null })
	state: string;

	@Column({ nullable: true, default: null })
	country: string;

	@Column({ nullable: true, default: null })
	zip: number;

	@Column({ default: false })
	is_password_changed: boolean;

	static async createUser(profile: any): Promise<User> {
		try {
			const user = new User();
			user.first_name = profile.first_name;
			user.last_name = profile.last_name;
			user.email = profile.email;
			user.logged_in_with = profile.logged_in_with;
			user.token = profile.token;
			user.refresh_token = profile.refresh_token;
			const save = await user.save();
			return save;
		} catch (err) {
			throw err;
		}
	}
}

export default User;
