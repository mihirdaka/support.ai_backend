// import { Column, Entity, PrimaryGeneratedColumn, JoinTable, Unique, OneToOne, OneToMany,JoinColumn, ManyToMany } from 'typeorm';

// // Entities
// import { BaseEntity } from '../base/base.entity';
// import { User } from './user.entity';
// // import { DecimalNumber } from 'aws-sdk/clients/glue';
// import { Point } from "typeorm";
// // import { Interest } from '../master/interest.entity';
// import { UserInterest } from './userInterest.entity';
// // import { float } from 'aws-sdk/clients/lightsail';



// export enum highestEducation {
//     SECSCH = "Secondary school",
//     UNDERGRAD = "Under grad",
//     POSTGRAD = "Post Grad",
//     OTHER = "Prefer not to say"
// }



// export enum relationStatus {
//     COMMITED = "Commited",
//     SINGLE = "Single",
//     OPEN = "Open relationship",
//     OTHER = "Prefer not to say"
// }




// @Entity('user_detail', { orderBy: { id: 'DESC' } })
// export class UserDetail extends BaseEntity {

//     @PrimaryGeneratedColumn({ type: 'int' })
//     id: number;

//     @Column({ nullable: false, default: 0 })
//     userId: number;

//     @Column({ nullable: true, default: '' })
//     bio: string;

//     @Column('double',{ nullable: true, default: 0.0, })
//     height: number;

//     @Column({
//         type: "enum",
//         enum: highestEducation,
//         default: null,
//     })
//     highestEducation: highestEducation;

//     @Column({
//         type: "enum",
//         enum: relationStatus,
//         default: null,
//     })
//     relationStatus: relationStatus;

//     @Column('double', {nullable: true ,default : 0.0} )
//     latLocation: number;

//     @Column('double',  {nullable: true ,default : 0.0} )
//     longLocation: number;

//     @OneToMany(() => UserInterest, (interest) => interest.userDetail,{
//         cascade: true,
//         eager:true,
        
//     })
//     // @JoinTable()
//     interests: UserInterest[]

//     @OneToOne(() => User)
//     @JoinColumn()
//     user: User;
// }
