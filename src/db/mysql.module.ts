// src/db/db.module.ts
import { Module } from '@nestjs/common';
import { MySQLService } from './mysql.service';

@Module({
  providers: [MySQLService],
  exports: [MySQLService],
})
export class DBModule {}
