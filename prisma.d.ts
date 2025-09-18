/* eslint-disable */
namespace PrismaJson {
  // GameRoom
  type GameRoomMemberRole = 'host' | 'member';
  type GameRoomMember = {
    id: bigint;
    accountId: bigint;
    role: GameRoomMemberRole;
    nickname: string;
    createdAt: string;
    updatedAt: string;
  };
}
