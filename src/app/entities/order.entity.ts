import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clientId: number;

    @Column()
    amount: number;

    @Column({ default: 'pending' })
    status: string;
}
