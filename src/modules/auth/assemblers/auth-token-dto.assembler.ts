import { AuthTokenDto } from '@module/auth/dto/auth-token.dto';
import { AuthToken } from '@module/auth/entities/auth-token.vo';

export class AuthTokenDtoAssembler {
  static convertToDto(authToken: AuthToken): AuthTokenDto {
    const dto = new AuthTokenDto();

    dto.accessToken = authToken.accessToken;

    return dto;
  }
}
