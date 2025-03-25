import { faker } from '@faker-js/faker';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import mysql, { Connection } from 'mysql2/promise';

type TableType = 'user' | 'chat' | 'chat_room' | 'work_notification_2025';

@Injectable()
export class MySQLService implements OnModuleInit, OnModuleDestroy {
  private connection!: Connection;

  async onModuleInit() {
    this.connection = await mysql.createConnection({
      host: 'localhost',
      port: 3300,
      user: 'testuser',
      password: 'testpass',
      database: 'test',
      connectTimeout: 60000,
      namedPlaceholders: true,
    });
    console.log('[MySQLService] Connected to MySQL');

    await this.insertMockUsersIfNeeded();
  }

  async onModuleDestroy() {
    await this.connection.end();
    console.log('[MySQLService] MySQL connection closed');
  }

  getConnection(): Connection {
    return this.connection;
  }

  private async insertMockUsersIfNeeded() {
    const targets = [
      { type: 'user', count: 883763 },
      { type: 'chat', count: 76839965 },
      { type: 'chat_room', count: 920106 },
      { type: 'work_notification_2025', count: 438715 },
    ];

    for (const { type, count } of targets) {
      await this.insertMockData(type as TableType, count);
    }
  }

  private async insertMockData(type: TableType, count: number) {
    try {
      const [rows] = await this.connection.query(
        `SELECT COUNT(no) as count FROM ${type}`,
      );
      const existing = (rows as { count: number }[])[0].count;
      if (existing > 0) {
        console.log(`[MySQLService] ${type} already has data (${existing})`);
        return;
      }

      const batchSize = 1000;
      const totalBatch = Math.ceil(count / batchSize);

      if (type === 'chat' || type === 'chat_room') {
        await this.connection.query(`ALTER TABLE ${type} DISABLE KEYS`);
      }

      const sqlMap = {
        user: 'INSERT INTO user (id, password, name, agg_slt1) VALUES ?',
        chat: 'INSERT INTO chat (id, content, from_id, readed, room_no, create_time) VALUES ?',
        chat_room:
          'INSERT INTO chat_room (user_id, manager_id, last_content, last_active_time, create_time) VALUES ?',
        work_notification_2025:
          'INSERT INTO work_notification_2025 (user_id, type, create_time) VALUES ?',
      };

      for (let batchIdx = 0; batchIdx < totalBatch; batchIdx++) {
        const start = batchIdx * batchSize;
        const batch = [];

        for (let j = 0; j < batchSize && start + j < count; j++) {
          const idx = start + j;

          switch (type) {
            case 'user':
              batch.push([
                `testuser-${idx}`,
                `testpass-${idx}`,
                `testname-${idx}`,
                idx % 8 === 0 ? 1 : 0,
              ]);
              break;

            case 'chat':
              batch.push([
                'iwedding',
                `msg-${idx}`, // 간소화!
                `testuser-${faker.number.int({ min: 1, max: 883763 })}`,
                '1',
                faker.number.int({ min: 1, max: 920106 }),
                new Date(),
              ]);
              break;

            case 'chat_room':
              batch.push([
                `testuser-${faker.number.int({ min: 1, max: 883763 })}`,
                'iwedding',
                `room-${idx}`, // 간소화!
                new Date(),
                new Date(),
              ]);
              break;

            case 'work_notification_2025':
              batch.push([
                `testuser-${faker.number.int({ min: 1, max: 883763 })}`,
                'crm-sms',
                new Date(),
              ]);
              break;
          }
        }

        await this.connection.query(sqlMap[type], [batch]);

        if (batchIdx % 10 === 0) {
          console.log(
            `[MySQLService] ${type}: ${start + batch.length}/${count}`,
          );
        }
      }

      if (type === 'chat' || type === 'chat_room') {
        await this.connection.query(`ALTER TABLE ${type} ENABLE KEYS`);
      }

      console.log(`[MySQLService] ${type} 모킹 데이터 삽입 완료`);
    } catch (e: unknown) {
      console.error('[MySQLService] 모킹 데이터 삽입 중 오류 발생', e);
    }
  }
}
