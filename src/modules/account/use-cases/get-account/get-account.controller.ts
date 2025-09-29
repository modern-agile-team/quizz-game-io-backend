import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AccountDtoAssembler } from '@module/account/assemblers/account-dto.assembler';
import { AccountDto } from '@module/account/dto/account.dto';
import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { GetAccountQuery } from '@module/account/use-cases/get-account/get-account.query';
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

@ApiTags('account')
@Controller()
export class GetAccountController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: '내 계정 조회' })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.NOT_FOUND]: [AccountNotFoundError],
  })
  @ApiOkResponse({ type: AccountDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('accounts/me')
  async getMe(@CurrentUser() currentUser: ICurrentUser) {
    try {
      const query = new GetAccountQuery({
        accountId: currentUser.id,
      });

      const account = await this.queryBus.execute<GetAccountQuery, Account>(
        query,
      );

      return AccountDtoAssembler.convertToDto(account);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
