import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomMemberCapacityExceededError } from '@module/game-room/errors/game-room-member-capacity-exceeded.error';

import { generateEntityId } from '@common/base/base.entity';

describe(GameRoom, () => {
  let gameRoom: GameRoom;

  beforeEach(() => {
    gameRoom = GameRoomFactory.build({});
  });

  describe(GameRoom.prototype.joinMember, () => {
    beforeEach(() => {
      gameRoom = GameRoomFactory.build({
        maxMembersCount: 8,
        currentMembersCount: 1,
      });
    });

    describe('멤버로 추가하는 경우', () => {
      it('구성원을 반환해야한다.', () => {
        expect(gameRoom.joinMember(generateEntityId())).toBeInstanceOf(
          GameRoomMember,
        );
      });
    });

    describe('멤버 수가 최대 수를 초과하는 경우', () => {
      beforeEach(() => {
        gameRoom = GameRoomFactory.build({
          maxMembersCount: 8,
          currentMembersCount: 8,
        });
      });
      it('멤버 제한을 초과했다는 에러가 발생해야한다.', () => {
        expect(() => gameRoom.joinMember(generateEntityId())).toThrow(
          GameRoomMemberCapacityExceededError,
        );
      });
    });
  });
});
