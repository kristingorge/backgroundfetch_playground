import { } from ".";
import { storeSegment } from "./db_schema";

declare var self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event: ExtendableEvent) => {
    // Use waitUntil to make sure the ServiceWorker doesn't accidentally get killed by the browser.
    // Skip waiting to install latest version since there are no breaking change right now.
    event.waitUntil(self.skipWaiting());
});

// Claim ownership over the parent page without waiting for a new navigation event. This reduces having to reload
// during development.
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// Post message to all open tabs associated with this ServiceWorker.
async function postMessage(msg: any) {
    const allClients = await self.clients.matchAll({type: 'window'});
    for (const client of allClients) {
        client.postMessage(msg);
    }
}

async function handleBackgroundFetchEvent(event: any) {
    await postMessage({
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
    event.waitUntil(handleBackgroundFetchEvent(event));
});

self.addEventListener('backgroundfetchsuccess', async (event: any) => {
    const process = async () => {
        const records = await event.registration.matchAll();
        for (const record of records) {
            let response = record.responseReady;
            try {
                response = await response;
            } catch (e) {
                console.error('No response for ' + record.request.url + ': ' + e.message);
                return Promise.resolve(null);
            }
    
            const buffer = await response.arrayBuffer();
            await storeSegment(response.url, buffer);
        }

        handleBackgroundFetchEvent(event);
    };

    event.waitUntil(process());
});

self.addEventListener('backgroundfetchfail', async (event: any) => {
    event.waitUntil(handleBackgroundFetchEvent(event));
});

self.addEventListener('backgroundfetchabort', async (event: any) => {
    event.waitUntil(handleBackgroundFetchEvent(event));
});