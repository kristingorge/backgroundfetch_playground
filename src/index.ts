import { log } from "./logger";
import {addClickHandlers} from "./actions";
import { orchestrator } from "./progress";
import { getAll } from "./db";
import { DownloadableState } from "./downloadable_item";
import { setServiceWorkerRegistration } from "./background_fetch_manager";
import { MANAGER } from "./download_manager";

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

const registrationPromise = registerServiceWorker();
registrationPromise.then(async (registration) => {
    setServiceWorkerRegistration(registration);
    addClickHandlers();

    const items = (await getAll()) as DownloadableState[];

    for (const i of items) {
        MANAGER.addDownload(i);
    }
});

orchestrator.mount();

