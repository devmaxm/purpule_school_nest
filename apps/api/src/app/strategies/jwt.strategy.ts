import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from "@nestjs/config";
import {IJWTPayload} from "@purpule-school/interfaces";
import {Injectable} from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    console.log(configService.get('JWT_ACCESS_SECRET'))
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_ACCESS_SECRET')
    });
  }

  async validate({id}: IJWTPayload) {
    return {id}
  }
}
