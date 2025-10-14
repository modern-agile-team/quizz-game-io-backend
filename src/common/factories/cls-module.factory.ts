import { DynamicModule } from '@nestjs/common';

import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ClsModule } from 'nestjs-cls';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaModule } from '@shared/prisma/prisma.module';

export const ClsModuleFactory = (): DynamicModule => {
  return ClsModule.forRoot({
    plugins: [
      new ClsPluginTransactional({
        imports: [PrismaModule],
        adapter: new TransactionalAdapterPrisma({
          prismaInjectionToken: PRISMA_SERVICE,
        }),
      }),
    ],
    middleware: { mount: true },
    global: true,
  });
};
