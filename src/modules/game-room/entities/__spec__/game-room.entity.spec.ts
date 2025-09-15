import { GameRoomMemberFactory } from '@module/game-room/entities/__spec__/game-room-member.factory';
import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import {
  GameRoomMember,
  GameRoomMemberRole,
} from '@module/game-room/entities/game-room-member.entity';
import {
  GameRoom,
  GameRoomStatus,
  GameRoomVisibility,
} from '@module/game-room/entities/game-room.entity';
import { GameRoomMemberAlreadyExistsError } from '@module/game-room/errors/game-room-member-already-exists.error';
import { GameRoomValidationError } from '@module/game-room/errors/game-room-validation.error';

import { generateEntityId } from '@common/base/base.entity';

describe(GameRoom, () => {
  let gameRoom: GameRoom;

  beforeEach(() => {
    gameRoom = GameRoomFactory.build({});
  });

  describe(GameRoom.create, () => {
    let createProps: Parameters<typeof GameRoom.create>[0];

    beforeEach(() => {
      createProps = {
        status: GameRoomStatus.waiting,
        visibility: GameRoomVisibility.public,
        title: 'title',
        maxMembersCount: 8,
        hostAccountId: generateEntityId(),
        hostNickname: 'nickname',
      };
    });

    describe('게임방을 생성하면', () => {
      it('호스트와 함께 게임방을 생성해야한다.', () => {
        const gameRoom = GameRoom.create(createProps);

        expect(gameRoom).toEqual(
          expect.objectContaining({
            status: createProps.status,
            visibility: createProps.visibility,
            title: createProps.title,
            maxMembersCount: createProps.maxMembersCount,
            members: expect.arrayContaining([
              expect.objectContaining({
                accountId: createProps.hostAccountId,
                nickname: createProps.hostNickname,
              }),
            ]),
          }),
        );
      });
    });
  });

  describe(GameRoom.prototype.joinMember, () => {
    let member: GameRoomMember;

    beforeEach(() => {
      gameRoom = GameRoomFactory.build({
        maxMembersCount: 8,
      });
    });

    describe('구성원이 입장하면', () => {
      beforeEach(() => {
        member = GameRoomMemberFactory.build();
      });

      it('구성원이 추가돼야한다.', () => {
        expect(gameRoom.joinMember(member)).toBeInstanceOf(GameRoomMember);
        expect(gameRoom.members).toEqual(expect.arrayContaining([member]));
      });
    });

    describe('이미 게임방 구성원인 사용자가 입장하면', () => {
      beforeEach(() => {
        member = GameRoomMemberFactory.build();
        gameRoom.joinMember(member);
      });

      it('이미 존재하는 구성원이라는 에러가 발생해야한다.', () => {
        expect(() => gameRoom.joinMember(member)).toThrow(
          GameRoomMemberAlreadyExistsError,
        );
      });
    });

    describe('호스트가 있을 때 호스트로 새로이 참가하려는 경우', () => {
      beforeEach(() => {
        const host = GameRoomMemberFactory.build({
          role: GameRoomMemberRole.host,
        });
        gameRoom.joinMember(host);
        member = GameRoomMemberFactory.build({
          role: GameRoomMemberRole.host,
        });
      });

      it('호스트는 한명만 가능하다는 에러가 발생해야한다.', () => {
        expect(() => gameRoom.joinMember(member)).toThrow(
          GameRoomValidationError,
        );
      });
    });

    /**
     * @todo 추가
     */
    describe.skip('정원이 꽉찬 경우', () => {
      beforeEach(() => {
        member = GameRoomMemberFactory.build({
          role: GameRoomMemberRole.player,
        });
      });

      it('정원이 초과했다는 에러가 발생해야한다.', () => {});
    });
  });

  describe(GameRoom.prototype.leaveMember, () => {
    describe('구성원이 게임방을 떠나면', () => {
      let member: GameRoomMember;

      beforeEach(() => {
        member = GameRoomMemberFactory.build();
        gameRoom.joinMember(member);
      });

      it('구성원에서 제거돼야한다.', () => {
        gameRoom.leaveMember(member);
        expect(gameRoom.members).toEqual(expect.not.arrayContaining([member]));
      });
    });
  });

  describe(GameRoom.prototype.changeMemberRole, () => {
    describe('역할을 변경하면', () => {
      let member: GameRoomMember;

      beforeEach(() => {
        member = GameRoomMemberFactory.build();
        gameRoom.joinMember(member);
      });

      it('역할이 변경돼야한다.', () => {
        const newRole = GameRoomMemberRole.host;
        expect(gameRoom.changeMemberRole(member, newRole)).toEqual(
          expect.objectContaining({
            role: newRole,
          }),
        );
      });
    });

    describe('호스트가 존재할 때 호스트로 역할을 변경하려는 경우', () => {
      let host: GameRoomMember;
      let member: GameRoomMember;

      beforeEach(() => {
        host = GameRoomMemberFactory.build({ role: GameRoomMemberRole.host });
        member = GameRoomMemberFactory.build({
          role: GameRoomMemberRole.player,
        });
        gameRoom.joinMember(host);
      });

      it('게임방에 호스트는 한명만 가능하다는 에러가 발생해야한다.', () => {
        expect(() =>
          gameRoom.changeMemberRole(member, GameRoomMemberRole.host),
        ).toThrow(GameRoomValidationError);
      });
    });
  });
});
