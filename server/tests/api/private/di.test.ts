import type { Prisma } from '@prisma/client';
import type { DtoId } from 'api/@types/brandedId';
import type { UserDto } from 'api/@types/user';
import controller from 'api/private/tasks/di/controller';
import type { TaskEntity } from 'domain/task/model/taskEntity';
import fastify from 'fastify';
import { brandedId } from 'service/brandedId';
import type { JwtUser } from 'service/types';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';

test('Dependency Injection', async () => {
  const jwtUser: JwtUser = {
    sub: brandedId.user.dto.parse(''),
    'cognito:username': 'dummy-user',
    email: 'aa@example.com',
  };
  const user: UserDto = {
    id: jwtUser.sub,
    signInName: jwtUser['cognito:username'],
    email: jwtUser.email,
    createdTime: Date.now(),
  };
  const res1 = await controller(fastify()).get({ jwtUser, user });

  expect(res1.body).toHaveLength(0);

  const mockedFindManyTask = async (
    _: Prisma.TransactionClient,
    authorId: DtoId['user'],
  ): Promise<TaskEntity[]> => [
    {
      id: brandedId.task.entity.parse(ulid()),
      label: 'baz',
      done: false,
      image: undefined,
      createdTime: Date.now(),
      author: { id: brandedId.user.entity.parse(authorId), signInName: user.signInName },
    },
  ];

  const res2 = await controller
    .inject({ listByAuthorId: mockedFindManyTask })(fastify())
    .get({ jwtUser, user });

  expect(res2.body).toHaveLength(1);
});
