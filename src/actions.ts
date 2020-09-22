import $ from "jquery";
import { orchestrator } from "./progress";
import { log } from "./logger";
import { DownloadableState } from "./downloadable_item";
import * as SampleDownloads from "./sample_downloadable_items";
import { MANAGER } from "./download_manager";


export function addClickHandlers() {
    $("#action-single").click(async (e) => {
        if (!('BackgroundFetchManager' in self)) {
            log('browser does not support background fetch :(');
            return;
        }
        const dl = new DownloadableState(SampleDownloads.SINGLE);
        await dl.startDownload();

        MANAGER.addDownload(dl);
    });

    // Fetches 50 ~1.5 MB video segments.
    $("#action-multiple").click(async (e) => {
        if (!('BackgroundFetchManager' in self)) {
            log('browser does not support background fetch :(');
            return;
        }
        const dl = new DownloadableState(SampleDownloads.MULTI);
        await dl.startDownload();

        MANAGER.addDownload(dl);
    });
}