import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ProfileAvatarPutErrorEnum,
  ProfileAvatarPutErrorMsgEnum,
} from '../../app/users/users.enum';
import * as path from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        {
          errorCode: ProfileAvatarPutErrorEnum.WrongFormat,
          message: ProfileAvatarPutErrorMsgEnum.WrongFormat,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      ),
      false,
    );
  }
  callback(null, true);
};
export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = path.extname(file.originalname);
  const randomName = Array(6)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
