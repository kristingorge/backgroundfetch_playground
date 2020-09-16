import * as idb from 'idb';
import { BackgroundFetchRegistration } from './background_fetch';
import { ItemStatus } from './item_status';

export interface DownloadableStateDocument {
    fetchId: string|null;
    itemId: string;
    startedAt: Date|null;
    completedAt: Date|null;
    status: ItemStatus;
    backgroundFetch: Pick<BackgroundFetchRegistration, "result" | "failureReason" | "downloaded" | "downloadTotal">|null;
}

export interface IDbStorable {
    fromStorageDocument(_storageKey: string, dbState: DownloadableStateDocument, fetchRegistration: BackgroundFetchRegistration|null): void;
    idbStorageKey(): string;
    toStorageDocument(): DownloadableStateDocument;
}

export interface TestDB extends idb.DBSchema {
    items: {
        key: string;
        value: DownloadableStateDocument;
        indexes: { 'by-fetch-id': 'fetchId' };
    },
    segments: {
        key: string;
        value: ArrayBuffer;
    }
}

const DB_NAME = 'db';

let _db: idb.IDBPDatabase<TestDB> | null = null;
export async function openDb() {
    if (_db == null) {
        _db = await idb.openDB(DB_NAME, 1, {
            upgrade(db) {
                const itemStore = db.createObjectStore('items');

                itemStore.createIndex('by-fetch-id', 'fetchId');

                db.createObjectStore('segments');
            }
        });
    }

    return _db;
}

export async function store(obj: IDbStorable) {
    await (await openDb()).put('items', obj.toStorageDocument(), obj.idbStorageKey());
}

export async function storeSegment(url: string, data: ArrayBuffer) {
    await (await openDb()).put('segments', data, url);
}
