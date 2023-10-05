import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import {JWTAuthGuard} from "../guards/jwt.guard";
import {UserId} from "../guards/user-id.decorator";
import {RMQService} from "nestjs-rmq";
import {AccountUpdateProfile, AccountUserCourses, AccountUserInfo} from "@purpule-school/contracts";
import {UpdateProfileDto} from "../dtos/update-profile.dto";

@Controller('users')
export class UsersController {
  constructor(
    private readonly rmqService: RMQService
  ) {
  }

  @Get(':id/courses')
  async courses(@Param('id') id: string): Promise<AccountUserCourses.Response> {
    try {
      return  await this.rmqService.send<AccountUserCourses.Request, AccountUserCourses.Response>(AccountUserCourses.topic, {id})
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException(e.message);
      }
      console.log(e)
    }
  }

  @UseGuards(JWTAuthGuard)
  @Get('me')
  async info(@UserId() userId: string) {
    try {
      return await this.rmqService.send<AccountUserInfo.Request, AccountUserInfo.Response>(AccountUserInfo.topic, {id: userId})
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
      console.log(e)
    }
  }

  @UseGuards(JWTAuthGuard)
  @Post('me')
  async updateProfile(@UserId() userId: string, @Body() dto: UpdateProfileDto) {
    try {
      return await this.rmqService.send<AccountUpdateProfile.Request, AccountUpdateProfile.Response>(AccountUpdateProfile.topic, {id: userId, ...dto})
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
      console.log(e)
    }
  }
}
