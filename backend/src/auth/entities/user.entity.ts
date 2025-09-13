import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  Id: string;

  @Column({ name: 'username', type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({ name: 'First_Name', type: 'varchar', length: 50, nullable: false })
  First_Name: string;

  @Column({ name: 'Last_Name', type: 'varchar', length: 50, nullable: true })
  Last_Name: string;

  @Column({ name: 'Email', type: 'varchar', length: 50, unique: true, nullable: false })
  Email: string;

  @Column({ name: 'Hashed_Password', type: 'varchar', length: 50, nullable: false })
  @Exclude()
  Hashed_Password: string;

  @Column({ name: 'dob', type: 'timestamp', nullable: true })
  dob: Date;

  @Column({ name: 'Is_Active', type: 'boolean', default: false })
  Is_Active: boolean;

  @Column({ name: 'Is_deleted', type: 'boolean', default: false })
  Is_deleted: boolean;

  @CreateDateColumn({ name: 'Created_at', type: 'timestamp' })
  Created_at: Date;

  @Column({ name: 'Created_by', type: 'uuid', nullable: true })
  Created_by: string;

  @UpdateDateColumn({ name: 'Updated_at', type: 'timestamp' })
  Updated_at: Date;

  @Column({ name: 'Updated_by', type: 'uuid', nullable: true })
  Updated_by: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.Hashed_Password) {
      this.Hashed_Password = await bcrypt.hash(this.Hashed_Password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.Hashed_Password);
  }
}
