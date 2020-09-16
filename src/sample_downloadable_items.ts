import { DownloadableItem } from "./downloadable_item";

export const SINGLE: DownloadableItem = {
    id: 'single',
    segments: ['https://bitmovin-a.akamaihd.net/content/MI201109210084_1/video/720_2400000/dash/segment_0.m4s'],
    totalSize: 1434989
};

// Triggering different background fetch scenarios for testing purposes.
// Test video files are from https://bitmovin.com/demos/stream-test

let videoSegments: string[] = [];
for(let i = 0; i < 50; i++) {
    videoSegments.push(
        `https://bitmovin-a.akamaihd.net/content/MI201109210084_1/video/720_2400000/dash/segment_${i}.m4s`);
}

export const MULTI: DownloadableItem = {
    id: 'multi',
    segments: videoSegments,
    totalSize: 61626553
};

export const ITEMS = {
    [SINGLE.id]: SINGLE,
    [MULTI.id]: MULTI
}
