import { log } from "./logger";
import {addClickHandlers} from "./actions";

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
registrationPromise.then((registration) => {
    serviceWorkerRegistration = registration;
    addClickHandlers();
});