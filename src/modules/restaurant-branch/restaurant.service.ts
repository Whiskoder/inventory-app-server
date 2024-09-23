import { Repository } from 'typeorm'

import { Restaurant } from '@modules/restaurant/models'
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from '@modules/restaurant/dtos'
import { HTTPResponseDto, PaginationDto } from '@modules/shared/dtos'
import { BadRequestException, NotFoundException } from '@core/errors'
import { CalculatePaginationUseCase } from '@modules/shared/use-cases'

export class RestaurantService {
  constructor(private readonly restaurantRepository: Repository<Restaurant>) {}

  public async createRestaurant(
    createRestaurantDto: CreateRestaurantDto
  ): Promise<HTTPResponseDto> {
    const isExistingRestaurant = await this.restaurantRepository.update(
      { name: createRestaurantDto.name, isActive: false },
      { isActive: true }
    )

    if (isExistingRestaurant.affected === 1)
      return HTTPResponseDto.accepted(
        `Restaurant ${createRestaurantDto.name} already exists`
      )
    const restaurantEntity =
      this.restaurantRepository.create(createRestaurantDto)
    await this.restaurantRepository.save(restaurantEntity)

    return HTTPResponseDto.created('Restaurant created succesfully', {
      restaurants: [restaurantEntity],
    })
  }

  public async getAllCategories(
    paginationDto: PaginationDto
  ): Promise<HTTPResponseDto> {
    const { limit, skip, page: currentPage } = paginationDto
    const [restaurants, totalItems] =
      await this.restaurantRepository.findAndCount({
        take: limit,
        skip,
        where: { isActive: true },
      })

    const pagination = CalculatePaginationUseCase.execute({
      currentPage,
      limit,
      totalItems,
      skip,
    })

    return HTTPResponseDto.ok(undefined, { restaurants, pagination })
  }

  public async getRestaurantByTerm(term: string): Promise<HTTPResponseDto> {
    let restaurant
    if (Number(term)) {
      restaurant = await this.restaurantRepository.findOne({
        where: { id: +term, isActive: true },
      })
    } else {
      restaurant = await this.restaurantRepository.findOne({
        where: { name: term.toLowerCase(), isActive: true },
      })
    }

    if (!restaurant) throw new NotFoundException('Restaurant not found')
    return HTTPResponseDto.ok(undefined, { restaurants: [restaurant] })
  }

  public async updateRestaurant(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto
  ): Promise<HTTPResponseDto> {
    const restaurantEntity =
      this.restaurantRepository.create(updateRestaurantDto)
    const updateRestaurant = await this.restaurantRepository.update(
      { isActive: true, id },
      restaurantEntity
    )

    if (!updateRestaurant.affected)
      throw new NotFoundException('Restaurant not found')

    return HTTPResponseDto.ok('Restaurant updated successfully')
  }

  public async deleteRestaurant(id: number): Promise<HTTPResponseDto> {
    const deleteRestaurant = await this.restaurantRepository.update(id, {
      isActive: false,
    })

    if (!deleteRestaurant.affected)
      throw new NotFoundException('Restaurant not found')

    return HTTPResponseDto.noContent()
  }
}
