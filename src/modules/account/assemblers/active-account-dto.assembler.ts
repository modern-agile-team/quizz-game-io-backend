import { ActiveAccountSocketEventDto } from '@module/account/dto/active-account-socket-event.dto';

export class ActiveAccountDtoAssembler {
  static convertToSocketEventDto(
    currentActiveAccountsCount: number,
  ): ActiveAccountSocketEventDto {
    const dto = new ActiveAccountSocketEventDto();

    dto.currentActiveAccountsCount = currentActiveAccountsCount;

    return dto;
  }
}
