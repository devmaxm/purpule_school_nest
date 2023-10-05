import {RMQService} from "nestjs-rmq";
import {UserEntity} from "./entities/user.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserEventEmitter {
  constructor(
    private readonly rmqService: RMQService
  ) {
  }

  async handle(user: UserEntity) {
    for (const event of user.events) {
      await this.rmqService.notify(event.topic, event.data)
    }
  }

}
