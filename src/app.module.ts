import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBModule } from './db/mysql.module';

@Module({
  imports: [DBModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
