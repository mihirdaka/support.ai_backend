import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany ,JoinColumn , OneToOne} from 'typeorm';

// Entities
import { BaseEntity } from '../base/base.entity';


export enum UserGender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum AuthType {
  email = "email",
  google = "google",
  facebook = "facebook",
}

@Entity('user', { orderBy: { id: 'DESC' } })
export class User extends BaseEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 100, nullable: false })
  @Unique(['email'])
  email: string;

  @Column({ length: 100, nullable: false, select: false })
  password: string;

  @Column({ length: 255, nullable: false })
  firstName: string;

  @Column({ length: 255, nullable: false })
  lastName: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({
    type: "enum",
    enum: UserGender,
    default: null,
  })
  gender: UserGender

  @Column({
    type: "enum",
    enum: AuthType,
    default: null,
  })
  authType: AuthType

  @Column({ default: null })
  dateOfBirth: Date;

  toJSON() {
    delete this.isDeleted;
    return this;
  }

  
  
  
}
