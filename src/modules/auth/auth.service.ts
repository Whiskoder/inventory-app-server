import { Repository } from 'typeorm'

import { BadRequestException, InternalServerErrorException } from '@core/errors'
import { bcryptAdapter, JWT } from '@config/plugins'
import { CreateHTTPResponseDto } from '@modules/shared/dtos'
import { RegisterUserDto, LoginUserDto } from '@modules/auth/dtos'
import { User } from '@modules/user/models'
// import { EmailService } from '@presentation/services'

export class AuthService {
  constructor(
    private readonly jwt: JWT,
    private readonly userRepository: Repository<User>
  ) {}

  private generateToken(userId: number) {
    const tokenOptions = {
      payload: { id: userId },
      duration: '12h',
    }
    return this.jwt.generateToken(tokenOptions)
  }

  public async registerUser(registerUserDto: RegisterUserDto) {
    const isExistingUser = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    })

    if (isExistingUser) throw new BadRequestException('Email already in use')

    const hasedPassword = bcryptAdapter.hash(registerUserDto.password)
    const userEntity = this.userRepository.create({
      ...registerUserDto,
      password: hasedPassword,
    })
    await this.userRepository.save(userEntity)

    const token = await this.generateToken(userEntity.id)
    const { password, ...user } = userEntity

    if (!token)
      throw new InternalServerErrorException('Unable to generate token')

    //* Send user entity to avoid sending password in response
    return CreateHTTPResponseDto.created(undefined, { user, token })
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
      select: [
        'email',
        'firstName',
        'id',
        'lastName',
        'password',
        'role',
        'contactPhone',
        'branch',
      ],
    })

    if (!user) throw new BadRequestException('Invalid credentials provided')

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    )

    if (!isMatching)
      throw new BadRequestException('Invalid credentials provided')

    const token = await this.generateToken(user.id)
    const { password, ...userEntity } = user

    if (!token)
      throw new InternalServerErrorException('Unable to generate token')

    //* Send user entity to avoid sending password in response
    return CreateHTTPResponseDto.ok(undefined, {
      user: userEntity,
      token,
    })
  }

  public async checkAuth(user: User) {
    return CreateHTTPResponseDto.ok(undefined, {
      user,
    })
  }
}
