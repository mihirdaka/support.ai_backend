import httpStatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
// Interfaces
import IController from '../../interfaces/IController';
import {
  ICreateUser,
  ILoginUser,
  IUpdateUser,
  IUserQueryParams,
} from '../../interfaces/user.interface';
import { IDeleteById, IDetailById, IDetailByUserName } from '../../interfaces/common.interface';

// Errors
import { StringError } from '../../errors/string.error';

// Services
import userService from '../../services/user/user.service';

// Utilities
import ApiResponse from '../../utilities/api-response.utility';
import Encryption from '../../utilities/encryption.utility';
import ApiUtility from '../../utilities/api.utility';

// Constants
import constants from '../../constants';

const create: IController = async (req, res) => {
  try {
    const params: ICreateUser = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      authType: req.body.authType,
     
      dateOfBirth : req.body.dateOfBirth,
    }
    var user = await userService.create(params);
    const cookie = await generateUserCookie(user.id);
    user = Object.assign({
      "token" : cookie.value
    },user);
    return ApiResponse.result(res, user, httpStatusCodes.CREATED);
  } catch (e) {
    if (e.code === constants.ERROR_CODE.DUPLICATED) {
      return ApiResponse.error(res, httpStatusCodes.CONFLICT, 'Email already exists.');
    }
    return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};

const login: IController = async (req, res) => {
  try {
    const params: ILoginUser = {
      email: req.body.email,
      password: req.body.password,
    }
    var user = await userService.login(params);
    const cookie = await generateUserCookie(user.id);
    // const token = await generateAccessToken(user.id);
    user = Object.assign({
      "token" : cookie.value
    },user);
    return ApiResponse.result(res, user, httpStatusCodes.OK);
  } catch (e) {
    if (e instanceof StringError) {
      return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST, e.message);
    }
    return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST, e.message);
  }
};


const me: IController = async (req, res) => {
  const cookie = await generateUserCookie(req.user.id);

  return ApiResponse.result(res, req.user, httpStatusCodes.OK);
};

const detail: IController = async (req, res) => {
  try {
    const params: IDetailById = {
      id: req.user.id,
    }
    const data = await userService.detail(params);
    return ApiResponse.result(res, data, httpStatusCodes.OK);
  } catch (e) {
    ApiResponse.exception(res, e);
  }
};

const update: IController = async (req, res) => {
  try {
    const params: IUpdateUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      id: parseInt(req.params.id, 10),
    }
    await userService.update(params);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (e) {
    ApiResponse.exception(res, e);
  }
};

const updateMe: IController = async (req, res) => {
  try {
    const params: IUpdateUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      id: req.user.id,
    }
    await userService.update(params);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (e) {
    ApiResponse.exception(res, e);
  }
};




const list: IController = async (req, res) => {
  try { 
    const limit = ApiUtility.getQueryParam(req, 'limit');
    const page = ApiUtility.getQueryParam(req, 'page');
    const keyword = ApiUtility.getQueryParam(req, 'keyword');
    const params: IUserQueryParams = { limit, page, keyword };
    const data = await userService.list(params);
    return ApiResponse.result(res, data.response, httpStatusCodes.OK, null,null, null,data.pagination);
  } catch (e) {
    ApiResponse.exception(res, e);
  }
};

const remove: IController = async (req, res) => {
  try {
    const params: IDeleteById = {
      id: parseInt(req.params.id, 10),
    }
    await userService.remove(params);
    return ApiResponse.result(res, params, httpStatusCodes.OK);
  } catch (e) {
    ApiResponse.exception(res, e);
  }
};



const checkUser: IController = async (req, res) => {
  try {
    const params: IDetailByUserName = {
      userName: req.body.userName,
    }
    var detail = await userService.checkUser(req.body);
    return ApiResponse.result(res, detail, httpStatusCodes.OK);
  } catch (e) {
    ApiResponse.exception(res, e);
  }
};




const checkEmailExist: IController = async (req, res) => {
  try {
    var detail = await userService.checkEmailAlreadyExist(req.body);
    return ApiResponse.result(res, detail, httpStatusCodes.OK);
  } catch (e) {
    ApiResponse.exception(res, e);
  }
};

const generateUserCookie = async (userId: number) => {
  return {
    key: constants.COOKIE.COOKIE_USER,
    value: await Encryption.generateCookie(constants.COOKIE.KEY_USER_ID, userId.toString()),
  };
};

const generateAccessToken = async (userId: number) => {
  return jwt.sign({userId: userId}, process.env.TOKEN_SECRET_KEY, { expiresIn :  '1h' });
}

export default {
  create,
  login,
  me,
  detail,
  update,
  updateMe,
  list,
  remove,
  checkUser,
  checkEmailExist,
};
