import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('relatory')
export class Relatory {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  workedMinutes: number;

  @Column()
  exceedingMinutes: number;

  @Column()
  missingMinutes: number;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
