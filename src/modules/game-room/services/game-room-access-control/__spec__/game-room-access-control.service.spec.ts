import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomMemberFactory } from '@module/game-room/entities/__spec__/game-room-member.factory';
import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoomAccessDeniedError } from '@module/game-room/errors/game-room-access-denied.error';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { GameRoomAccessControlService } from '@module/game-room/services/game-room-access-control/game-room-access-control.service';
import {
  AllowMemberProps,
  GAME_ROOM_ACCESS_CONTROL_SERVICE,
  IGameRoomAccessControlService,
} from '@module/game-room/services/game-room-access-control/game-room-access-control.service.interface';

import { generateEntityId } from '@common/base/base.entity';

describe(GameRoomAccessControlService, () => {
  let service: IGameRoomAccessControlService;

  let gameRoomRepository: GameRoomRepositoryPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GameRoomRepositoryModule],
      providers: [
        {
          provide: GAME_ROOM_ACCESS_CONTROL_SERVICE,
          useClass: GameRoomAccessControlService,
        },
      ],
    }).compile();

    service = module.get<IGameRoomAccessControlService>(
      GAME_ROOM_ACCESS_CONTROL_SERVICE,
    );

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
  });

  describe(GameRoomAccessControlService.prototype.allowMember, () => {
    let props: AllowMemberProps;

    beforeEach(() => {
      props = {
        accountId: generateEntityId(),
        gameRoomId: generateEntityId(),
      };
    });

    describe('게임방의 구성원인 경우', () => {
      beforeEach(async () => {
        await gameRoomRepository.insert(
          GameRoomFactory.build({
            id: props.gameRoomId,
            members: [
              GameRoomMemberFactory.build({
                accountId: props.accountId,
              }),
            ],
          }),
        );
      });

      it('에러가 발생하지 않아야한다.', async () => {
        await expect(service.allowMember(props)).resolves.toBeUndefined();
      });
    });

    describe('게임방이 존재하지 않는 경우', () => {
      it('게임방의 접근 권한이 없다는 에러가 발생해야한다.', async () => {
        await expect(service.allowMember(props)).rejects.toThrow(
          GameRoomAccessDeniedError,
        );
      });
    });

    describe('게임방의 구성원이 아닌 경우', () => {
      beforeEach(async () => {
        await gameRoomRepository.insert(GameRoomFactory.build({}));
      });

      it('게임방의 접근 권한이 없다는 에러가 발생해야한다.', async () => {
        await expect(service.allowMember(props)).rejects.toThrow(
          GameRoomAccessDeniedError,
        );
      });
    });
  });
});
