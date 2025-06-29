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

    return dto;
  }
}
