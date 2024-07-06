import type { UserDto } from 'api/@types/user';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: UserDto;
  };
}>;
