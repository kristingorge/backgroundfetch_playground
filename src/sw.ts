import { } from ".";
import * as db from "./db";
import { BackgroundFetchRegistration } from "./background_fetch";
import { DownloadableState } from "./downloadable_item";
import { setServiceWorkerRegistration, getServiceWorkerRegistration } from "./background_fetch_manager";

declare var self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event: ExtendableEvent) => {
    // Use waitUntil to make sure the ServiceWorker doesn't accidentally get killed by the browser.
    // Skip waiting to install latest version since there are no breaking change right now.
    event.waitUntil(self.skipWaiting());
});

// Claim ownership over the parent page without waiting for a new navigation event. This reduces having to reload
// during development.
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

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
    const registration = event.registration as BackgroundFetchRegistration;

    if (!getServiceWorkerRegistration()) {
        setServiceWorkerRegistration(self.registration);
    }

    const process = async () => {
        const records = await registration.matchAll();
        
        await Promise.all(records.map(async record => {
            try {
                const response = await record.responseReady;
                const buffer = await response.arrayBuffer();

                console.log(`Storing segment: ${response.url}`);
                await db.storeSegment(response.url, buffer);
                await postMessage(`Stored data for ${response.url.substring(response.url.length - 20)}`);    
            } catch (e) {
                console.error('No response for ' + record.request.url + ': ' + e.message);
                return Promise.resolve(null);
            }
        }));

        console.log(`updating download state to complete`);
        const dl = (await db.get(registration.id)) as DownloadableState;
        dl.updateFromRegistration(registration);

        console.log(`sending background fetch success event`);
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