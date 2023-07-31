import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMetadata } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

export function createTestModule({
  exports,
  controllers,
  imports,
  providers,
}: Partial<ModuleMetadata>): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [HttpModule, ConfigModule, ...(imports || [])],
    providers,
    controllers,
    exports,
  }).compile();
}
