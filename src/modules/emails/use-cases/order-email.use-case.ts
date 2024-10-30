import { Order } from '@/modules/order/models'
import { User } from '@/modules/user/models'

import { format } from 'date-fns'
import { es as esLocale } from 'date-fns/locale/es'
import {
  createdOrderEmailTemplate,
  CreatedOrderEmailTemplateProps,
} from '@modules/emails/templates'
import { EmailService, SendMailOptions } from '@modules/emails/services'

export class OrderEmailsUseCase {
  public static sendCreatedOrderEmail = (
    service: EmailService,
    orderEntity: Order,
    userEntities: User[]
  ) => {
    const { folio: orderFolio } = orderEntity
    return userEntities.forEach(async ({ email, firstName }) => {
      const deliveryDate = format(
        orderEntity.deliveryDate,
        'EEEE, MMMM dd, yyyy',
        { locale: esLocale }
      )

      const { name, streetName, dependantLocality, cityName, postalCode } =
        orderEntity.branch
      const items = [streetName, dependantLocality, cityName, postalCode]

      const address =
        items.reduce((address, item) => {
          if (item) address = `${address}, ${item}`
          return address
        }, name) ?? ''

      const props: CreatedOrderEmailTemplateProps = {
        address,
        deliveryDate,
        username: firstName,
        downloadOrderLink: `orders/details/${orderFolio}`,
        folio: orderFolio,
      }
      const htmlBody = await createdOrderEmailTemplate(props)

      const options: SendMailOptions = {
        htmlBody,
        to: email,
        subject: `Tienes un nuevo pedido - ${orderFolio}`,
        from: 'no-responder@sistemasdealimentacion.com.mx',
      }
      await service.sendEmail(options)
    })
  }
}
