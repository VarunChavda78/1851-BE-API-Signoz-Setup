import { 
    Entity, PrimaryGeneratedColumn, Column, 
    CreateDateColumn, UpdateDateColumn, DeleteDateColumn 
  } from "typeorm";
  
  @Entity("lp_name_history")
  export class LpNameHistory {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "int", nullable: true })
    lpId: number;
  
    @Column({ type: "varchar", length: 255, nullable: true })
    name: string;
  
    @Column({ type: "varchar", length: 255, nullable: true})
    nameSlug: string;
  
    @CreateDateColumn({ type: "timestamp", nullable: true })
    createdAt: Date;
  
    @UpdateDateColumn({ type: "timestamp", nullable: true })
    updatedAt: Date;
  
    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt: Date;
  
    @Column({ type: "int", nullable: true })
    createdBy: number;
  
    @Column({ type: "int", nullable: true })
    updatedBy: number;
  }
  