import $ from "jquery";
import { getBackgroundFetchManager } from ".";
import { log } from "./logger";

// Triggering different background fetch scenarios for testing purposes.
// Test video files are from https://bitmovin.com/demos/stream-test

export function addClickHandlers() {
    $("#action-single").click((e) => {
        // TODO: could add BackgroundFetchOptions to provide downloadTotal bytes.
        getBackgroundFetchManager().fetch(
            'single',
            'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/video/720_2400000/dash/segment_0.m4s'
        );
        log('Started single fetch');
    });
}