import { DownloadableState } from "./downloadable_item";
import { orchestrator, DownloadStateBar } from "./progress";

class DownloadManager {
    downloads: DownloadableState[] = [];
    downloadBars: DownloadStateBar[] = [];

    addDownload(dl: DownloadableState) {
        this.downloads.push(dl);
        const bar = new DownloadStateBar(dl);
        this.downloadBars.push(bar);

        dl.addEventListener('requestrender', (_e: Event) => {
            orchestrator.requestRender(bar);
        });

        orchestrator.addDownloadStateBar(bar);
    }
}

export const MANAGER = new DownloadManager();