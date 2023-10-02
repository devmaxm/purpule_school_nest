import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserRepository} from "../user/repositories/user.repository";
import {JwtService} from "@nestjs/jwt";
import {UserEntity} from "../user/entities/user.entity";
import {UserRole} from "@purpule-school/interfaces";
import {AccountRegister} from "@purpule-school/contracts";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email)
    if (!user) {
      throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST)
    }
    const userEntity = new UserEntity(user)
    const isCorrectPassword = userEntity.validatePassword(password)
    if (!isCorrectPassword) {
      throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST)
    }
    return {id: user._id}
  }

  public async register({email, password, displayName}: AccountRegister.Request) {
    const isUserExist = await this.userRepository.findUser(email)
    if (isUserExist) {
      throw new HttpException('User with this email is already exist', HttpStatus.BAD_REQUEST)
    }
    const newUserEntity = await new UserEntity({
      email,
      displayName,
      hashPassword: '',
      role: UserRole.Student
    }).setPassword(password)
    const newUser = await this.userRepository.createUser(newUserEntity)
    return {email: newUser.email}
  }


  public async login(id: string) {
    return {
      access_token: await this.jwtService.signAsync({id}, )
    }
  }
}
