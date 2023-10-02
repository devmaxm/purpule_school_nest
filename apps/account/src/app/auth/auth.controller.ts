import {Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {IsOptional, IsString, MinLength} from "class-validator";

class RegisterDto {
  @IsString()
  email: string

  @IsString()
  @MinLength(7)
  password: string

  @IsString()
  @IsOptional()
  displayName?: string
}

class LoginDto {
  @IsString()
  email: string

  @IsString()
  @MinLength(7)
  password: string
}


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Post('register')
  async register({email, password, displayName}: RegisterDto) {
    return await this.authService.register(email, password, displayName)
  }

  @Post('login')
  async login({email, password}: LoginDto) {
    const {id} = await this.authService.validateUser(email, password)
    return await this.authService.login(id)
  }

}

