import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose'

import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {getMongoConfig} from "./configs/mongo.config";

@Module({
  imports: [
    MongooseModule.forRootAsync(getMongoConfig()),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
