import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose'

import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {getMongoConfig} from "./configs/mongo.config";
import {ConfigModule} from "@nestjs/config";
import {RMQModule} from "nestjs-rmq";
import {getRMQConfig} from "./configs/rmq.config";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: 'envs/.account.env'}),
    MongooseModule.forRootAsync(getMongoConfig()),
    RMQModule.forRootAsync(getRMQConfig()),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
