import { orchestrator, DownloadStateBar } from "./progress";
import { store } from "./db_schema";
import { BackgroundFetchRegistration, BackgroundFetchFailureReason, BackgroundFetchResult } from "./background_fetch";
import { ITEMS } from "./sample_downloadable_items";
import { getBackgroundFetchManager } from ".";
import { IDbStorable, DownloadableStateDocument } from "./db_schema";
import { ItemStatus } from "./item_status";

export type DownloadableItemId = string;

export interface DownloadableItem {
    id: DownloadableItemId;
    segments: RequestInfo[];
    totalSize: number;
}


export class DownloadableState implements IDbStorable {
    itemId!: DownloadableItemId;
    status!: ItemStatus;
    startedAt!: Date|null;
    completedAt!: Date|null;
    fetchRegistration!: BackgroundFetchRegistration|null;
    backgroundFetch!: Pick<BackgroundFetchRegistration, "result" | "failureReason" | "downloaded" | "downloadTotal">|null;
    downloadStateBar!: DownloadStateBar;
    
    get downloadedPct(): number {
        if (!this.backgroundFetch) {
            return 0;
        }
        return this.backgroundFetch.downloaded / this.backgroundFetch.downloadTotal;
    }

    get item(): DownloadableItem {
        return ITEMS[this.itemId];
    }

    constructor(item?: DownloadableItem) {
        if (!item) {
            return;
        }

        this.itemId = item.id;
        this.status = ItemStatus.NOT_DOWNLOADED;
        this.startedAt = null;
        this.completedAt = null;
        this.fetchRegistration = null;
        this.backgroundFetch = null;
        this.downloadStateBar = new DownloadStateBar(this);
    }

    async startDownload() {
        this.startedAt = new Date();
        const reg = await getBackgroundFetchManager().fetch(this.item.id, this.item.segments, {
            downloadTotal: this.item.totalSize,
            title: this.item.id
        });
        this.fetchRegistration = reg;
        this.addFetchListeners(reg);
        store(this);
    }

    async abortDownload() {
        if (!this.fetchRegistration) {
            throw 'no fetch registration!';
        }

        await this.fetchRegistration.abort();

        this.status = ItemStatus.NOT_DOWNLOADED;
        this.backgroundFetch = null;
    
        store(this);
    }

    async retryDownload() {
        this.startedAt = null;
        this.fetchRegistration = null;
        this.startDownload();
    }

    private addFetchListeners(fetchRegistration: BackgroundFetchRegistration) {
        fetchRegistration.addEventListener('progress', () => {
            if (fetchRegistration.result == BackgroundFetchResult.InProgress) {
                this.status = ItemStatus.DOWNLOADING;
            }
            else if (fetchRegistration.result == BackgroundFetchResult.Success) {
                this.status = ItemStatus.DOWNLOADED;

                if (!this.completedAt) {
                    this.completedAt = new Date();
                }
            }
            else if (fetchRegistration.result == BackgroundFetchResult.Failure) {
                this.status = ItemStatus.FAILED;
            }

            this.backgroundFetch = {
                downloadTotal: fetchRegistration.downloadTotal,
                downloaded: fetchRegistration.downloaded,
                result: fetchRegistration.result,
                failureReason: fetchRegistration.failureReason,
            };
            orchestrator.requestRender(this.downloadStateBar);

            store(this);
        });
    }

    fromStorageDocument(_storageKey: string, dbState: DownloadableStateDocument, fetchRegistration: BackgroundFetchRegistration|null) {
        this.itemId = dbState.itemId;
        this.status = dbState.status;
        this.startedAt = dbState.startedAt;
        this.completedAt = dbState.completedAt;
        this.fetchRegistration = fetchRegistration;
        this.backgroundFetch = dbState.backgroundFetch;

        this.downloadStateBar = new DownloadStateBar(this);

        if (fetchRegistration) {
            this.addFetchListeners(fetchRegistration);
        }

        orchestrator.requestRender(this.downloadStateBar);
    }

    idbStorageKey() {
        return this.itemId;
    }

    toStorageDocument() {
        return {
            itemId: this.itemId,
            fetchId: this.fetchRegistration == null ? null : this.fetchRegistration.id,
            status: this.status,
            startedAt: this.startedAt,
            completedAt: this.completedAt,
            backgroundFetch: this.backgroundFetch
        };
    }
}

