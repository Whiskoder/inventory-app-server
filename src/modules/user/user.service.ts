import { Repository } from 'typeorm'

import { User } from '@modules/user/models'
import { CreateHTTPResponseDto } from '@modules/shared/dtos'
import { InternalServerErrorException, NotFoundException } from '@core/errors'
import { RoleConfig } from '@/config/role.config'

export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}
}
