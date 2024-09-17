import { Repository } from 'typeorm'

import { BadRequestException, InternalServerErrorException } from '@core/errors'
import { bcryptAdapter, JWT } from '@config/plugins'
import { HTTPResponseDto } from '@modules/shared/dtos'
import { RegisterUserDto, LoginUserDto } from '@modules/auth/dtos'
import { User } from '@modules/user/models'
// import { EmailService } from '@presentation/services'

export class AuthService {
  constructor(
    private readonly jwt: JWT,
    private readonly userRepository: Repository<User>
  ) {}

  public generateToken(userId: number) {
    const tokenOptions = {
      payload: { id: userId },
    }
    return this.jwt.generateToken(tokenOptions)
  }

  public async registerUser(registerUserDto: RegisterUserDto) {
    const isExistingUser = await this.userRepository.findOne({
      where: { emailAddress: registerUserDto.emailAddress },
    })

    if (isExistingUser) throw new BadRequestException('Email already in use')

    const hasedPassword = bcryptAdapter.hash(registerUserDto.password)
    const user = await this.userRepository.save({
      ...registerUserDto,
      password: hasedPassword,
    })

    const token = await this.generateToken(user.id)
    const { password, ...userEntity } = user

    if (!token)
      throw new InternalServerErrorException('Unable to generate token')

    //* Send user entity to avoid sending password in response
    return HTTPResponseDto.created(undefined, { user: userEntity, token })
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        emailAddress: loginUserDto.emailAddress,
      },
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
    return HTTPResponseDto.ok(undefined, {
      user: userEntity,
      token,
    })
  }
}
