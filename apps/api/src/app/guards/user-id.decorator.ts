import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const UserId = createParamDecorator((data: undefined, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest()?.user.id
})
