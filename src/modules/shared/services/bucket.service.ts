import { UploadedFile } from 'express-fileupload'

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  Type,
} from '@aws-sdk/client-s3'

export class BucketService {
  private readonly S3Client: S3Client

  constructor(
    private readonly bucketEndpoint: string,
    private readonly bucketName: string,
    private readonly bucketClientId: string,
    private readonly bucketClientSecret: string
  ) {
    this.S3Client = new S3Client({
      region: 'auto',
      credentials: {
        accessKeyId: this.bucketClientId,
        secretAccessKey: this.bucketClientSecret,
      },
      endpoint: this.bucketEndpoint,
    })
  }

  putObject(key: string, file: UploadedFile) {
    const putParams = {
      Bucket: this.bucketName,
      Key: `${key}`,
      Body: file.data,
      ContentType: file.mimetype,
    }
    const command = new PutObjectCommand(putParams)
    return this.S3Client.send(command)
  }

  getObject(key: string) {
    const getParams = {
      Bucket: this.bucketName,
      Key: key,
      range: 'bytes=0-9',
    }

    const command = new GetObjectCommand(getParams)
    return this.S3Client.send(command)
  }
}
