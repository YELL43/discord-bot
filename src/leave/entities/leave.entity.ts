import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Leave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  reason: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  discordId: string;

  @Column({ nullable: true })
  discordChannelId: string;
}