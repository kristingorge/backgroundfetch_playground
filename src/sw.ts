import { } from ".";

declare var self: ServiceWorkerGlobalScope;
declare var clients: any;

self.addEventListener("install", (event: ExtendableEvent) => {
    // Use waitUntil to make sure the ServiceWorker doesn't accidentally get killed by the browser.
    // Skip waiting to install latest version since there are no breaking change right now.
    event.waitUntil(self.skipWaiting());
});

// Post message to all open tabs associated with this ServiceWorker.
async function postMessage(msg: any) {
    const allClients = await clients.matchAll({type: 'window'});
    for (const client of allClients) {
        client.postMessage(msg);
    }
}

function handleBackgroundFetchEvent(event: any) {
    postMessage({
        eventType: event.type,
        id: event.registration.id,
        downloaded: event.registration.downloaded,
        downloadTotal: event.registration.downloadTotal,
        uploaded: event.registration.uploaded,
        uploadTotal: event.registration.uploadTotal,
        failureReason: event.registration.failureReason,
    });
}

self.addEventListener('backgroundfetchclick', (event: any) => {
    handleBackgroundFetchEvent(event);
});

self.addEventListener('backgroundfetchsuccess', async (event: any) => {
    handleBackgroundFetchEvent(event);
});

self.addEventListener('backgroundfetchfail', async (event: any) => {
    handleBackgroundFetchEvent(event);
});

self.addEventListener('backgroundfetchabort', async (event: any) => {
    handleBackgroundFetchEvent(event);
});