// indexed db helper file

import * as idb from 'idb';
import { DownloadableItemId, DownloadableState } from './downloadable_item';
import { getBackgroundFetchManager } from './background_fetch_manager';
import { ItemStatus } from './item_status';
import { BackgroundFetchRegistration } from './background_fetch';


export async function get(itemId: DownloadableItemId): Promise<IDbStorable|null> {
    const db = await openDb();
    const doc = await db.get('items', itemId);
    db.close();

    if (!doc) {
        return null;
    }

    return await stateFromDoc(itemId, doc);
}

async function stateFromDoc(storageKey: string, doc: DownloadableStateDocument) {
    const reg = doc.fetchId == null ? null : await getBackgroundFetchManager().get(doc.fetchId);

    const dl = new DownloadableState();
    dl.fromStorageDocument(storageKey, doc, reg);

    return dl;
} 

export async function getAll(): Promise<IDbStorable[]> {
    const db = await openDb();
    const docs = await db.getAll('items');
    db.close();

    return Promise.all(docs.map(d => stateFromDoc(d.itemId, d)));
}

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
