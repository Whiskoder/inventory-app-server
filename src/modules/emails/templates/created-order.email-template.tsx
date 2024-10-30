import {
  Html,
  Tailwind,
  Head,
  Text,
  Body,
  Section,
  Container,
  Heading,
  Row,
  Column,
  Button,
  Link,
  Img,
  render,
} from '@react-email/components'
import * as React from 'react'

export interface CreatedOrderEmailTemplateProps {
  folio: string
  address: string
  deliveryDate: string
  downloadOrderLink: string
  username: string
}

export const CreatedOrderEmailTemplate = (
  props: CreatedOrderEmailTemplateProps
) => {
  const { folio, deliveryDate, address, downloadOrderLink, username } = props

  const baseUrl = 'https://sistemasdealimentacion.app'
  const location = 'México'

  return (
    <Html lang='en'>
      <Head />
      <Tailwind>
        <Body className='font-sans bg-white mx-auto my-auto'>
          <Container className='border border-solid border-[#eaeaea] rounded-xl my-[40px] p-[60px] ax-w-[465px]'>
            <Img
              src={`${baseUrl}/iso-black.png`}
              width='auto'
              height='32'
              alt='Logo'
              className='my-0 mx-auto'
            />
            <Heading className='text-center text-base'>
              Se ha confirmado una nueva orden.
            </Heading>

            <Section className='mt-[64px]'>
              <Column>
                <Row>
                  <Text className='text-base font-medium'>
                    Folio de seguimiento
                  </Text>
                  <Text className='m-0 text-base'>{folio}</Text>
                </Row>
                <Row>
                  <Text className='text-base font-medium'>
                    Lugar de entrega
                  </Text>
                  <Text className='m-0 text-base'>{address}</Text>
                </Row>
                <Row>
                  <Text className='text-base font-medium'>
                    Fecha programada de entrega
                  </Text>
                  <Text className='m-0 text-base'>{deliveryDate}</Text>
                </Row>
              </Column>
            </Section>
            <Section className='text-center mt-[64px] mb-[64px]'>
              <Button
                className='bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                href={`${baseUrl}/${downloadOrderLink}`}>
                Haz click aqui para ver mas detalles
              </Button>
            </Section>
            <Text className='text-black text-[14px] leading-[24px]'>
              En caso de que no funcione, copia y pega el siguiente enlace en tu
              navegador:{' '}
              <Link
                href={`${baseUrl}/${downloadOrderLink}`}
                className='text-blue-600 no-underline'>
                {`${baseUrl}/${downloadOrderLink}`}
              </Link>
            </Text>
            <Text className='text-[#666666] text-[12px] leading-[24px] '>
              Este correo estaba destinado a{' '}
              <span className='text-black'>{username}</span>. Fue enviado desde{' '}
              <span className='text-black'>{baseUrl}</span> ubicada en{' '}
              <span className='text-black'>{location}</span>. Si no estabas
              esperando ninguna orden, puedes ignorar este correo.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export const createdOrderEmailTemplate = async (
  props: CreatedOrderEmailTemplateProps
) => {
  const emailHtml = await render(
    <CreatedOrderEmailTemplate
      folio={props.folio}
      deliveryDate={props.deliveryDate}
      address={props.address}
      downloadOrderLink={props.downloadOrderLink}
      username={props.username}
    />
  )
  return emailHtml
}
