// Interfaces
// import { AuthType } from 'aws-sdk/clients/codebuild';
import { AuthType, UserGender } from '../entities/user/user.entity';
import { IBaseQueryParams } from './common.interface';

export interface ICreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: UserGender;
  authType: AuthType;

  
  dateOfBirth: Date;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IUpdateUser {
  id: number;
  firstName: string;
  lastName: string;
}



// export interface ICreateUserDetail {
//   id: number;
//   firstName: string;
//   lastName: List;
// }
export interface IUserQueryParams extends IBaseQueryParams {
  keyword?: string;
}
