import {Body, Controller} from "@nestjs/common";
import {RMQRoute} from "nestjs-rmq";
import {AccountBuyCourse, AccountCheckPayment, AccountUpdateProfile} from "@purpule-school/contracts";
import {UserService} from "./user.service";

@Controller()
export class UserCommands {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @RMQRoute(AccountUpdateProfile.topic)
  async updateProfile(@Body() {id, displayName}: AccountUpdateProfile.Request): Promise<AccountUpdateProfile.Response> {
    return await this.userService.updateProfile(id, displayName)
  }

  @RMQRoute(AccountBuyCourse.topic)
  async buyCourse(@Body() {userId, courseId}: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
    return await this.userService.buyCourse(userId, courseId)
  }

  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment(@Body() {userId, courseId}: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    return await this.userService.checkPayment(userId, courseId)
  }
}
