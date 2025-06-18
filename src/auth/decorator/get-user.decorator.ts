import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type UserPayload = {
  sub: string;
  email: string;
};

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext): UserPayload | string => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as UserPayload;
  return data && data in user ? user[data as keyof UserPayload] : user;
});
