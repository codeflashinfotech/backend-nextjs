import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { AWSError, S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { UploadFileNameErrorMsgEnum } from './upload.enum';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class UploadService {
  constructor(
    @InjectAwsService(S3)
    private readonly s3Service: S3,
  ) {}

  /**
   * @desc upload data to s3
   * @param {PutObjectRequest} param
   * @param {string} param.ACL  by default is 'public-read'
   * @param {S3.ManagedUpload.ManagedUploadOptions} options
   * */
  uploadToS3(
    param: PutObjectRequest,
    options?: S3.ManagedUpload.ManagedUploadOptions,
  ): Promise<S3.ManagedUpload.SendData> {
    param.ACL = param.ACL ? param.ACL : 'public-read';
    return this.s3Service.upload(param, options).promise();
  }

  /**
   * @desc make a unique file name with file format
   * @param {string} fileName name of the file notice that if pass wrong format you get error  correct format: fileName.png
   * @param {string} prefix if not pass a prefix it will be file name
   * @return {string} unique string
   * @example  avatar-fc5ba444-dc51-4b.jpeg
   * */
  uniqueFileName(fileName: string, prefix?: string): string {
    const splicedFileName: Array<string> = fileName.split('.');
    if (splicedFileName.length == 1)
      throw new Error(UploadFileNameErrorMsgEnum.WrongFormat);
    return `${
      prefix ? prefix.toUpperCase() : splicedFileName[0]
    }-${randomStringGenerator()}.${splicedFileName[1]}`;
  }

  /**
   * @desc delete a file from s3
   * */
  deleteFromS3(
    param: S3.DeleteObjectRequest,
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    return this.s3Service.deleteObject(param).promise();
  }
}
