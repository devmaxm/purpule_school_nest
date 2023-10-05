import {Body, Controller, HttpException, HttpStatus} from "@nestjs/common";
import {UserRepository} from "./repositories/user.repository";
import {AccountUserCourses, AccountUserInfo} from "@purpule-school/contracts";
import {UserEntity} from "./entities/user.entity";
import {RMQRoute} from "nestjs-rmq";

@Controller()
export class UserQueries {
  constructor(
    private readonly userRepository: UserRepository
  ) {
  }

  @RMQRoute(AccountUserInfo.topic)
  async userInfo(@Body() { id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
    const user = await this.userRepository.findUserById(id);
    const profile = new UserEntity(user).getPublicProfile();
    return {
      profile
    };
  }

  @RMQRoute(AccountUserCourses.topic)
  async getUserCourses({id} : AccountUserCourses.Request): Promise<AccountUserCourses.Response> {
    const user = await this.userRepository.findUserById(id)
    return {
      courses: user.courses
    }
  }
}
