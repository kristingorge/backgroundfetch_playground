import { log } from "./logger";
import {addClickHandlers} from "./actions";
import { orchestrator } from "./progress";
import { BackgroundFetchManager } from "./background_fetch";
import { getAll } from "./db";
import { DownloadableState } from "./downloadable_item";

async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    log('registering service worker');
    const registration = await navigator.serviceWorker.register('sw.ts', {scope:location.pathname});
    await navigator.serviceWorker.ready;
    log('service worker ready');

    navigator.serviceWorker.addEventListener('message', event => {
        log(event.data);
    });

    return registration;
}

let serviceWorkerRegistration: ServiceWorkerRegistration|null = null;
export function getServiceWorkerRegistration(): ServiceWorkerRegistration {
    return serviceWorkerRegistration!;
}

export function getBackgroundFetchManager(): BackgroundFetchManager {
    return (serviceWorkerRegistration as any).backgroundFetch as BackgroundFetchManager;
}

const registrationPromise = registerServiceWorker();
registrationPromise.then(async (registration) => {
    serviceWorkerRegistration = registration;
    addClickHandlers();

    const items = (await getAll()) as DownloadableState[];

    for (const i of items) {
        orchestrator.addDownloadStateBar(i.downloadStateBar);
    }
});

orchestrator.mount();

