import { getRepository } from 'typeorm';

// Entities
import { User } from '../../entities/user/user.entity';
import sendMail  from "../notification/mail.service";

// Utilities
import Encryption from '../../utilities/encryption.utility';
import ApiUtility from '../../utilities/api.utility';
import DateTimeUtility from '../../utilities/date-time.utility';
// Errors
import { StringError } from '../../errors/string.error';
import { dataSource } from '../../configs/orm.config';
// 
// import { getRepository } from "typeorm" 



// Interfaces
import {
  ICreateUser,
  ILoginUser,
  IUpdateUser,
  IUserQueryParams,
} from '../../interfaces/user.interface';
import { IDeleteById, IDetailById, IDetailByUserName } from '../../interfaces/common.interface';


import { raw } from 'body-parser';

// import { UserDetail } from 'src/entities/user/detail.entity';

const where = { isDeleted: false };

const create = async (params: ICreateUser) => {
  const item = new User();
  item.email = params.email;
  item.password = await Encryption.generateHash(params.password, 10);
  item.firstName = params.firstName;
  item.lastName = params.lastName;
  item.gender = params.gender;
  item.dateOfBirth = params.dateOfBirth;
  item.authType = params.authType;
  // item.userName = params.userName;

  const userData = await dataSource.getRepository(User).save(item);
  sendMail.sendWelcomeMail(userData);
  return ApiUtility.sanitizeUser(userData);
};

const login = async (params: ILoginUser) => {
  const rawUser = await dataSource.getRepository(User)
    .createQueryBuilder('user')
    // .leftJoinAndMapOne('user.profile', Picture, 'picture', 'user.id = picture.userId AND picture.isProfile = :Y', { Y: 'Y' })
    .where('user.email = :email', { email: params.email })
    .select([
      'user.id',
      'user.email',
      'user.password',
      'user.firstName',
      'user.lastName',
      'user.isDeleted',
      'user.gender',
      'user.createdAt',
      'user.updatedAt',
      'user.dateOfBirth',
     
      
    ])
    .getRawOne();


    if (!rawUser) {
      throw new StringError('Your email has not been registered');
    }

    const user = JSON.parse(JSON.stringify(rawUser)?.replaceAll('user_', ''))


  if (await Encryption.verifyHash(params.password, user.password)) {
    // notify user that accound is accessed

    sendMail.newLoginDetected(user);
    return ApiUtility.sanitizeUser(user);
  }

  throw new StringError('Your password is not correct');
};

const getById = async (params: IDetailById) => {
  try {
    const data = await dataSource.getRepository(User).findOneBy({ id: params.id });
    return ApiUtility.sanitizeUser(data);
  } catch (e) {
    return null;
  }
};

const detail = async (params: IDetailById) => {
  const query = {
    where: { ...where, id: params.id },
  }

  const user = await dataSource.getRepository(User)
    .createQueryBuilder('user')
    // .select(['user', 'picture', 'user_detail',])
    .where('user.id = :id', { id: params.id })

    .getOne();

  if (!user) {
    throw new StringError('User is not existed');
  }

  return ApiUtility.sanitizeUser(user);
}

const update = async (params: IUpdateUser) => {
  const query = { ...where, id: params.id };

  const user = await dataSource.getRepository(User).findOneBy(query);
  if (!user) {
    throw new StringError('User is not existed');
  }

  return await dataSource.getRepository(User).update(query, {
    firstName: params.firstName,
    lastName: params.lastName,
    updatedAt: DateTimeUtility.getCurrentTimeStamp(),
  });
}

const list = async (params: IUserQueryParams) => {
  let userRepo = dataSource.getRepository(User).createQueryBuilder('user')
  // .leftJoinAndMapOne('user.profilePicture', Picture, 'picture', 'user.id = picture.userId AND picture.isProfile = :Y', { Y: 'Y' })
  .select([
    'user',
    // 'picture.url',  'picture.thumbUrl '
  ]);
    
  userRepo = userRepo.where('user.isDeleted = :isDeleted', { isDeleted: false });

  if (params.keyword) {
    userRepo = userRepo.andWhere(
      '(LOWER(user.firstName) LIKE LOWER(:keyword) OR LOWER(user.lastName) LIKE LOWER(:keyword))',
      { keyword: `%${params.keyword}%` },
    );
  }

  // Pagination
  const paginationRepo = userRepo;
  const total = await paginationRepo.getMany();
  const pagRes = ApiUtility.getPagination(total.length, params.limit, params.page);

  userRepo = userRepo.limit(params.limit).offset(ApiUtility.getOffset(params.limit, params.page));
  const users = await userRepo.getMany();

  const response = [];
  if (users && users.length) {
    for (const item of users) {
      response.push((item));
    }
  }
  return { response, pagination: pagRes.pagination };
};






const remove = async (params: IDeleteById) => {
  const query = { ...where, id: params.id };

  const user = await dataSource.getRepository(User).findOneBy(query);
  if (!user) {
    throw new StringError('User is not existed');
  }

  return await dataSource.getRepository(User).update(query, {
    isDeleted: true,
    updatedAt: DateTimeUtility.getCurrentTimeStamp(),
  });
}



const checkUser = async (body: any) => {
  const query = {
    where: { email: body.email },
  }

  const user = await dataSource.getRepository(User).findOne(query);
  const response = [];

  if (!user) {
    // throw  response.push('UserName is available');
    return ApiUtility.sanitizeData({ status: true, message: 'userName is avaiable' });
  }
  else {
    // generate suggestions here
    var usernames: string | any[] = [];
    const date = new Date(body.dateOfBirth);
    let firstName = body.firstName.toLowerCase();
    let lastName = body.lastName.toLowerCase();
    let year = date.getUTCFullYear();
    let day = date.getUTCDate();
    usernames.push(firstName + lastName + year);
    usernames.push(lastName + firstName + day);
    usernames.push(firstName + lastName + day + year);

    return ApiUtility.sanitizeData({ status: false, message: 'Username not available, try something unique', suggestions: usernames });
  }

}


const checkEmailAlreadyExist = async (body: any) => {
  const query = {
    where: { email: body.email },
  }
  const user = await dataSource.getRepository(User).findOne(query);

  if (!user) {
    return ApiUtility.sanitizeData({ status: true, message: 'Email is not used' });
  }
  else {
    return ApiUtility.sanitizeData({ status: false, message: 'Email already exist, try logging in' });
  }

}






export default {
  create,
  login,
  getById,
  detail,
  update,
  list,
  remove,
  checkUser,
  checkEmailAlreadyExist,
}


