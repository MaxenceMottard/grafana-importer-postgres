import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  index: string;

  @Column('float')
  value: number;

  @Column('timestamp')
  timestamp: number;
}
