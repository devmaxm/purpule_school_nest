import { Module } from '@nestjs/common';
import {UsersController} from "./controllers/users.controller";
import {JwtModule} from "@nestjs/jwt";
import {getRMQConfig} from "./configs/rmq.config";
import {getJWTConfig} from "./configs/jwt.config";
import {RMQModule} from "nestjs-rmq";
import {ConfigModule} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";
import {AuthController} from "./controllers/auth.controller";
import {JwtStrategy} from "./strategies/jwt.strategy";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule
  ],
  controllers: [
    UsersController,
    AuthController
  ],
  providers: [
    JwtStrategy
  ],
})
export class AppModule {}
