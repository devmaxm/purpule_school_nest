import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {IsOptional, IsString, MinLength} from "class-validator";
import {AccountLogin, AccountRegister} from "@purpule-school/contracts";
import {RMQRoute} from "nestjs-rmq";


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }


  @RMQRoute(AccountRegister.topic)
  async register(@Body() {email, displayName, password}: AccountRegister.Request): Promise<AccountRegister.Response> {
    return await this.authService.register(email, password, displayName)
  }

  @RMQRoute(AccountLogin.topic)
  async login(@Body() {email, password}: AccountLogin.Request): Promise<AccountLogin.Response> {
    const {id} = await this.authService.validateUser(email, password)
    return await this.authService.login(id as string)
  }

}

