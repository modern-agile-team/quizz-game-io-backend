import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AccountCollectionDtoAssembler } from '@module/account/assemblers/account-collection-dto.assembler';
import { AccountCollectionDto } from '@module/account/dto/account-collection.dto';
import { Account } from '@module/account/entities/account.entity';
import { ListAccountsDto } from '@module/account/use-cases/list-accounts/list-accounts.dto';
import { ListAccountsQuery } from '@module/account/use-cases/list-accounts/list-accounts.query';

import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('account')
@Controller()
export class ListAccountsController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: '계정 목록 조회' })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @ApiOkResponse({ type: AccountCollectionDto })
  @Get('accounts')
  async listAccounts(@Query() dto: ListAccountsDto) {
    const query = new ListAccountsQuery({
      isActive: dto.isActive,
    });

    const accounts = await this.queryBus.execute<ListAccountsQuery, Account[]>(
      query,
    );

    return AccountCollectionDtoAssembler.convertToDto(accounts);
  }
}
