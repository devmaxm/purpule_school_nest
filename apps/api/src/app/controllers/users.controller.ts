import {Controller, Get, UseGuards} from "@nestjs/common";
import {JWTAuthGuard} from "../guards/jwt.guard";
import {UserId} from "../guards/user-id.decorator";

@Controller('users')
export class UsersController {
  constructor() {
  }

  @UseGuards(JWTAuthGuard)
  @Get('me')
  async info(@UserId() userId: string) {
    return {userId}
  }
}
