import { BackgroundFetchManager } from "./background_fetch";

let serviceWorkerRegistration: ServiceWorkerRegistration|null = null;
export function getServiceWorkerRegistration(): ServiceWorkerRegistration {
    return serviceWorkerRegistration!;
}

export function setServiceWorkerRegistration(swr: ServiceWorkerRegistration): void {
    serviceWorkerRegistration = swr;
}

export function getBackgroundFetchManager(): BackgroundFetchManager {
    return (serviceWorkerRegistration as any).backgroundFetch as BackgroundFetchManager;
}

