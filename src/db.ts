// indexed db helper file

import { DownloadableItemId, DownloadableState } from './downloadable_item';
import { getBackgroundFetchManager } from '.';
import { openDb, IDbStorable, DownloadableStateDocument } from './db_schema';


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