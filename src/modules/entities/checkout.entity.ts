import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Checkout {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: string;

    @Column()
    userId: string;

    @Column()
    status: string;
}
