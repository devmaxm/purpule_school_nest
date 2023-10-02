import {MongooseModuleAsyncOptions} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => {
      return {
        uri: getMongoUri(configService)
      }
    },
    inject: [ConfigService],
    imports: [ConfigModule]
  }
}

const getMongoUri = (configService: ConfigService) =>
  'mongodb+srv://' +
  configService.get('MONGO_LOGIN') +
  ':' +
  configService.get('MONGO_PASSWORD') +
  '@' +
  configService.get('MONGO_HOST') +
  '/?retryWrites=true&w=majority'

  // configService.get('MONGO_DATABASE') +

  // configService.get('MONGO_AUTHDATABASE');

