import $ from "jquery";
import { getBackgroundFetchManager } from ".";
import { log } from "./logger";
import { orchestrator, FetchProgress } from "./progress";

// Triggering different background fetch scenarios for testing purposes.
// Test video files are from https://bitmovin.com/demos/stream-test

let videoSegments: string[] = [];
for(let i = 0; i < 50; i++) {
    videoSegments.push(
        `https://bitmovin-a.akamaihd.net/content/MI201109210084_1/video/720_2400000/dash/segment_${i}.m4s`);
}

export function addClickHandlers() {
    $("#action-single").click(async (e) => {
        // TODO: could add BackgroundFetchOptions to provide downloadTotal bytes.
        let bgfRegistration = await getBackgroundFetchManager().fetch(
            'single',
            'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/video/720_2400000/dash/segment_0.m4s',
            { downloadTotal: 1434989 }
        );
        log('Started single fetch');

        orchestrator.addFetchProgress(new FetchProgress(bgfRegistration));
    });

    // Fetches 50 ~1.5 MB video segments.
    $("#action-multiple").click(async (e) => {
        let bgfRegistration = await getBackgroundFetchManager().fetch(
            'multiple',
            videoSegments,
            { downloadTotal: 61626553 }
        );
        log('Started multi-request fetch');

        orchestrator.addFetchProgress(new FetchProgress(bgfRegistration));
    });
}