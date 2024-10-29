import { Readable } from 'stream'
import { NextFunction, Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'

import { InvoiceService } from '@modules/invoice'
import {
  CreateInvoiceDto,
  FilterInvoiceDto,
  RelationsInvoiceDto,
  UpdateInvoiceDto,
} from '@modules/invoice/dtos'
import {
  CreateHTTPResponseDto,
  CreatePaginationDto,
  CreateSortingDto,
} from '@modules/shared/dtos'
import { BucketService } from '../shared/services/bucket.service'
import { UUID } from '@/config/plugins'
import {
  BadRequestException,
  InternalServerErrorException,
} from '@/core/errors'

export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly bucketService: BucketService
  ) {}

  //POST '/api/v1/invoices/'
  public createInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createInvoiceDto = await CreateInvoiceDto.create(req.body)
      const response = await this.invoiceService.createInvoice(createInvoiceDto)
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/invoices/:invoiceId'
  public getInvoiceById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const invoiceId = +req.params.invoiceId
    const relationsDto = await RelationsInvoiceDto.create(req.query)
    const response = await this.invoiceService.getInvoiceById(
      invoiceId,
      relationsDto
    )
    res.status(response.statusCode).json(response)
  }

  //GET '/api/v1/invoices/'
  public getInvoiceList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sortingProps = [
        'createdAt',
        'updatedAt',
        'paymentDate',
        'totalAmount',
      ]
      const paginationDto = await CreatePaginationDto.create(req.query)
      const sortingDto = await CreateSortingDto.create(req.query, sortingProps)
      const relationsDto = await RelationsInvoiceDto.create(req.query)
      const filterDto = await FilterInvoiceDto.create(req.query)

      const response = await this.invoiceService.getInvoiceList(
        paginationDto,
        sortingDto,
        relationsDto,
        filterDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //PUT '/api/v1/invoices/:invoiceId'
  public updateInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const invoiceId = +req.params.invoiceId
      const updateinvoiceDto = await UpdateInvoiceDto.create(req.body)
      const response = await this.invoiceService.updateInvoice(
        invoiceId,
        updateinvoiceDto
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //POST '/api/v1/invoices/files/'
  public uploadInvoiceFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const files = res.locals.files as UploadedFile[]
      const fileUrl = UUID.nanoid()
      const uploadedFileResponse = await this.bucketService.putObject(
        fileUrl,
        files[0]
      )
      if (uploadedFileResponse.$metadata.httpStatusCode !== 200)
        throw new InternalServerErrorException('Error uploading invoice')
      const fileExtension = files[0].mimetype.split('/')[1]
      const response = CreateHTTPResponseDto.created(
        'File uploaded successfully',
        { fileUrl, fileExtension }
      )
      res.status(response.statusCode).json(response)
    } catch (e) {
      next(e)
    }
  }

  //GET '/api/v1/invoices/files/:fileUrl'
  public getInvoiceFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const fileUrl = req.params.fileUrl

      const getFileResponse = await this.bucketService.getObject(fileUrl)
      const fileStream = getFileResponse.Body as Readable
      fileStream.pipe(res)
      fileStream.on('error', (err) => {
        throw new InternalServerErrorException('Error downloading file')
      })
    } catch (e: any) {
      if (e?.$metadata?.httpStatusCode === 404)
        throw new BadRequestException('No file found')
      next(e)
    }
  }
}
