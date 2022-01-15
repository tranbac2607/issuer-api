import sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import betterSqlite3 from 'better-sqlite3';


/**
 * Abstract class with common methods with sqlite.
 */
export abstract class Sqlite {
    abstract connect(file: string): any;
    abstract run(sql: string, ...params: any[]): any;
    abstract get(sql: string, ...params: any[]): any;
    abstract all(sql: string, ...params: any[]): any;
    abstract begin(): any;
    abstract commit(): any;
    abstract rollback(): any;
};

/**
 * Uses module sqlite3.
 */
class Sqlite3 extends Sqlite {
    private instance: sqlite.Database<sqlite3.Database, sqlite3.Statement> | undefined;

    async connect(file: string) {
        this.instance = await sqlite.open({
            filename: file,
            driver: sqlite3.Database
        });
    }

    async run(sql: string, ...params: any[]) {
        return this.instance?.run(sql, ...params);
    }

    async get(sql: string, ...params: any[]) {
        return this.instance?.get(sql, ...params);
    }

    async all(sql: string, ...params: any[]) {
        return this.instance?.all(sql, ...params);
    }

    async begin() {}

    async commit() {}

    async rollback() {}
}

/**
 * Uses module better-sqlite3.
 */
class BetterSqlite3 extends Sqlite {
    private instance: betterSqlite3.Database | undefined;

    async connect(file: string) {
        this.instance = await betterSqlite3(file);
    }

    async run(sql: string, ...params: any[]) {
        const statement = await this.instance?.prepare(sql);
        return statement?.run(...params);
    }

    async get(sql: string, ...params: any[]) {
        const statement = await this.instance?.prepare(sql);
        return statement?.get(...params);
    }

    async all(sql: string, ...params: any[]) {
        const statement = await this.instance?.prepare(sql);
        return statement?.all(...params);
    }

    async begin() {
        const statement = await this.instance?.prepare('BEGIN');
        return statement?.run();
    }

    async commit() {
        const statement = await this.instance?.prepare('COMMIT');
        return statement?.run();
    }

    async rollback() {
        const statement = await this.instance?.prepare('ROLLBACK');
        return statement?.run();
    }
}

export enum DatabaseType {
    SQLITE3 = 'sqlite3',
    BETTER_SQLITE3 = 'better-sqlite3'
};

/**
 * Factory class for sqlite's instances.
 */
export default class DB {
    static get(type: DatabaseType): Sqlite | undefined {
        if (type === DatabaseType.SQLITE3) {
            return new Sqlite3();
        }
        if (type === DatabaseType.BETTER_SQLITE3) {
            return new BetterSqlite3();
        }
    }
};