import $ from "jquery";
import { getBackgroundFetchManager } from ".";
import { log } from "./logger";
import { orchestrator } from "./progress";
import { DownloadableState } from "./downloadable_item";
import * as SampleDownloads from "./sample_downloadable_items";


export function addClickHandlers() {
    $("#action-single").click(async (e) => {
        const dl = new DownloadableState(SampleDownloads.SINGLE);
        await dl.startDownload();

        orchestrator.addDownloadStateBar(dl.downloadStateBar);
    });

    // Fetches 50 ~1.5 MB video segments.
    $("#action-multiple").click(async (e) => {
        const dl = new DownloadableState(SampleDownloads.MULTI);
        await dl.startDownload();

        orchestrator.addDownloadStateBar(dl.downloadStateBar);
    });
}