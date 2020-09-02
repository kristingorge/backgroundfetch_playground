import { log } from "./logger";
import {addClickHandlers} from "./actions";
import { orchestrator, FetchProgress } from "./progress";

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

export function getBackgroundFetchManager(): any {
    return (serviceWorkerRegistration as any).backgroundFetch;
}

const registrationPromise = registerServiceWorker();
registrationPromise.then(async (registration) => {
    serviceWorkerRegistration = registration;
    addClickHandlers();
    const currentFetchIds = await getBackgroundFetchManager().getIds();
    for (const id of currentFetchIds) {
        const registration = await getBackgroundFetchManager().get(id);
        orchestrator.addFetchProgress(new FetchProgress(registration));
    }
});

orchestrator.mount();

