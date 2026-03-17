import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as path from 'path';

const config = {
    url: `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`,
};
const adapter = new PrismaLibSql(config);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
