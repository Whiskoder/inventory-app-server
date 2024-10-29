import { Router } from 'express'

import { AppDataSource } from '@core/datasources'
import { AuthMiddleware } from '@core/middlewares'
import { Actions, Resources } from '@modules/user/enums'
import { Invoice } from '@modules/invoice/models'
import { InvoiceController, InvoiceService } from '@modules/invoice'
import { FileUploadMiddleware } from '@core/middlewares/file-upload.middleware'
import { BucketService } from '@modules/shared/services'
import { envs } from '@config/plugins'

export class InvoiceRoutes {
  static get routes(): Router {
    const router = Router({ caseSensitive: false })

    const invoiceRepository = AppDataSource.getRepository(Invoice)
    const invoiceService = new InvoiceService(invoiceRepository)
    const bucketService = new BucketService(
      envs.BUCKET_ENDPOINT,
      envs.BUCKET_NAME,
      envs.BUCKET_CLIENT_ID,
      envs.BUCKET_CLIENT_SECRET
    )
    const controller = new InvoiceController(invoiceService, bucketService)

    const resource = Resources.INVOICE

    router.use(AuthMiddleware.validateToken)

    router.post(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.CREATE)],
      controller.createInvoice
    )

    router.get(
      '/',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getInvoiceList
    )

    router.get(
      '/:invoiceId',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getInvoiceById
    )

    router.put(
      '/:invoiceId',
      [AuthMiddleware.checkPermission(resource, Actions.UPDATE)],
      controller.updateInvoice
    )

    router.post(
      '/files',
      [
        AuthMiddleware.checkPermission(resource, Actions.CREATE),
        FileUploadMiddleware.containFiles,
      ],
      controller.uploadInvoiceFile
    )

    router.get(
      '/files/:fileUrl',
      [AuthMiddleware.checkPermission(resource, Actions.READ)],
      controller.getInvoiceFile
    )

    return router
  }
}
