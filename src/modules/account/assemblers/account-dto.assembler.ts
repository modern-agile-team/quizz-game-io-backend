import { AccountSocketEventDto } from '@module/account/dto/account-socket-event.dto';
import { AccountDto } from '@module/account/dto/account.dto';
import { Account } from '@module/account/entities/account.entity';

export class AccountDtoAssembler {
  static convertToDto(account: Account): AccountDto {
    const dto = new AccountDto({
      id: account.id,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });

    dto.role = account.role;
    dto.signInType = account.signInType;
    dto.nickname = account.nickname;
    dto.enteredAt = account.enteredAt;

    return dto;
  }

  static convertToSocketEventDto(account: Account): AccountSocketEventDto {
    const dto = new AccountSocketEventDto();

    dto.accountId = account.id;
    dto.nickname = account.nickname;

    return dto;
  }
}
