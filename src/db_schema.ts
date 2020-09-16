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

export async function openDb() {
    return await idb.openDB(DB_NAME, 1, {
        upgrade(db) {
            const itemStore = db.createObjectStore('items');

            itemStore.createIndex('by-fetch-id', 'fetchId');

            db.createObjectStore('segments');
        }
    });;
}

export async function store(obj: IDbStorable) {
    const db = await openDb();
    await db.put('items', obj.toStorageDocument(), obj.idbStorageKey());
    db.close();
}

export async function storeSegment(url: string, data: ArrayBuffer) {
    const db = await openDb();
    await db.put('segments', data, url);
    db.close();
}
