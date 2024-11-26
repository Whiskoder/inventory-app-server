import { InternalServerErrorException } from '@core/errors'
import nodemailer, { Transporter } from 'nodemailer'

export interface SendMailOptions {
  from?: string
  to: string | string[]
  subject: string
  htmlBody: string
  attachments?: attachments[]
}

export interface attachments {
  filename: string
  path: string
}

export interface EmailServiceOptions {
  readonly defaultSender: string
  readonly mailerHost: string
  readonly mailerPort: number
  readonly mailerUser: string
  readonly mailerPass: string
  readonly postToProvider: boolean
}

export class EmailService {
  private transporter?: Transporter
  private defaultSender?: string
  private postToProvider?: boolean

  constructor(options: EmailServiceOptions) {
    this.init(options)
  }

  private init = (options: EmailServiceOptions) => {
    const {
      defaultSender,
      mailerHost,
      mailerPort,
      mailerUser,
      mailerPass,
      postToProvider,
    } = options

    this.postToProvider = postToProvider
    if (!postToProvider) return console.log('Email service is disabled')

    this.defaultSender = defaultSender
    this.transporter = nodemailer.createTransport({
      host: mailerHost,
      secure: true,
      port: mailerPort,
      auth: {
        user: mailerUser,
        pass: mailerPass,
      },
    })

    this.transporter.verify((error, success) => {
      console.log(error)
      if (error)
        throw new InternalServerErrorException('Error connecting to mailer')

      console.log('Connected to mailer')
    })
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const {
      from = this.defaultSender,
      to,
      subject,
      htmlBody,
      attachments = [],
    } = options

    try {
      if (!this.postToProvider) return true
      const sentInformation = await this.transporter!.sendMail({
        from,
        to,
        subject,
        html: htmlBody,
        attachments,
      })
      console.log(sentInformation)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
