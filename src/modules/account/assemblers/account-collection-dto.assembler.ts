import { AccountDtoAssembler } from '@module/account/assemblers/account-dto.assembler';
import { AccountCollectionDto } from '@module/account/dto/account-collection.dto';
import { Account } from '@module/account/entities/account.entity';

export class AccountCollectionDtoAssembler {
  static convertToDto(accounts: Account[]): AccountCollectionDto {
    const dto = new AccountCollectionDto();

    dto.data = accounts.map(AccountDtoAssembler.convertToDto);

    return dto;
  }
}
