import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



export class BasePicture extends BaseEntity{
  @Column({nullable: false,default : 'NA'})
  url: string;

  @Column({nullable: true})
  thumbUrl: string;
}