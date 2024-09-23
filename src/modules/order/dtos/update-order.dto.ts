import { plainToInstance, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
  validateOrReject,
} from 'class-validator'

import { ErrorMessages } from '@core/enums/messages'
import { BadRequestException } from '@core/errors'
// import { MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH } from '@core/constants'
import { OrderStatus } from '../enums'
import { descriptionLength } from '@/core/constants'

export class UpdateOrderDto {
  @IsOptional()
  @IsDateString()
  deliveryDate?: Date

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  nextOrderStep?: boolean

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  cancelOrder?: boolean
  // @Type(() => Number)
  // @IsOptional()
  //   @IsEnum(OrderStatus)
  //   orderStatus: OrderStatus

  @IsOptional()
  @IsString()
  @Length(1, descriptionLength)
  requestNotes?: string

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  restaurantId?: number

  @IsOptional()
  @IsString()
  @Length(1, descriptionLength)
  warehouseNotes?: string

  public static async create(obj: {
    [key: string]: any
  }): Promise<UpdateOrderDto> {
    if (!obj) throw new BadRequestException(ErrorMessages.EmptyBody)
    if (Object.keys(obj)) {
    }

    const {
      deliveryDate,
      nextOrderStep,
      cancelOrder,
      requestNotes,
      restaurantId,
      warehouseNotes,
    } = obj

    const dto = plainToInstance(UpdateOrderDto, {
      deliveryDate,
      nextOrderStep,
      cancelOrder,
      requestNotes,
      restaurantId,
      warehouseNotes,
    })
    await validateOrReject(dto)

    return dto
  }
}
