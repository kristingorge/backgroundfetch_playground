export interface BackgroundFetchManager {
    fetch(id: string, toFetch: RequestInfo | RequestInfo[], options: BackgroundFetchOptions): Promise<BackgroundFetchRegistration>;
    get(id: string): Promise<BackgroundFetchRegistration|null>;
    getIds(): Promise<string[]>;
}

export interface ImageResource {
    src: string;
    sizes?: string;
    type?: string;
}

export interface BackgroundFetchUIOptions {
    icons?: ImageResource[];
    title?: string;
}

export interface BackgroundFetchOptions extends BackgroundFetchUIOptions {
    downloadTotal?: number;
}

export enum BackgroundFetchFailureReason {
    // The background fetch has not completed yet, or was successful.
    "",
    // The operation was aborted by the user, or abort() was called.
    "aborted",
    // A response had a not-ok-status.
    "bad-status",
    // A fetch failed for other reasons, e.g. CORS, MIX, an invalid partial response,
    // or a general network failure for a fetch that cannot be retried.
    "fetch-error",
    // Storage quota was reached during the operation.
    "quota-exceeded",
    // The provided downloadTotal was exceeded.
    "download-total-exceeded"
};

export enum BackgroundFetchResult { InProgress = "", Success = "success", Failure = "failure" };

export interface BackgroundFetchRecord {
    request: Request;
    responseReady: Promise<Response>;
};

// from https://wicg.github.io/background-fetch/#background-fetch-registration
export interface BackgroundFetchRegistration extends EventTarget {
    id: string;
    uploadTotal: number;
    uploaded: number;
    downloadTotal: number;
    downloaded: number;
    result: BackgroundFetchResult;
    failureReason: BackgroundFetchFailureReason;
    recordsAvailable: boolean;

    abort(): Promise<boolean>;
    match(request: RequestInfo, options?: CacheQueryOptions): Promise<BackgroundFetchRecord>;
    matchAll(request: RequestInfo, options?: CacheQueryOptions): Promise<Array<BackgroundFetchRecord>>;
}
