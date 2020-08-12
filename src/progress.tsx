import prettyBytes from 'pretty-bytes';
import { h } from "tsx-dom";
import $ from "jquery";

enum BackgroundFetchFailureReason {
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

enum BackgroundFetchResult { "", "success", "failure" };

interface BackgroundFetchRecord {
    request: Request;
    responseReady: Promise<Response>;
};

// from https://wicg.github.io/background-fetch/#background-fetch-registration
interface BackgroundFetchRegistration extends EventTarget {
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

class FetchDisplayOrchestrator {
    private fetchProgressItems: FetchProgress[] = [];

    constructor(private $container: JQuery) { }

    public addFetchProgress(fetch: FetchProgress) {
        this.fetchProgressItems.push(fetch);
        this.requestRender(fetch);
    }

    public render() {
        return <div id="all-fetch-progresses-container">
            {this.fetchProgressItems.map(fetch => this.renderSingle(fetch))}
        </div>;
    }

    public mount() {
        this.$container.append(this.render());
    }

    renderSingle(fetch: FetchProgress) {
        return <div class="fetch-progress-container"
            data-fetch-progress-container-id={fetch.backgroundFetchRegistration.id}>
            {fetch.render()}
        </div>;
    }

    public requestRender(fetch: FetchProgress) {
        if (this.fetchProgressItems.indexOf(fetch) === -1) {
            throw new Error('what is this?');
        }

        const $fetchContainer = this.$container
            .find(`div[data-fetch-progress-container-id=${fetch.backgroundFetchRegistration.id}]`);

        if ($fetchContainer.length > 0) {
            $fetchContainer.eq(0).children().eq(0).replaceWith(fetch.render());
        }
        else {
            this.$container.prepend(this.renderSingle(fetch));
        }
    }
}

export class FetchProgress {
    constructor(public readonly backgroundFetchRegistration: BackgroundFetchRegistration) {
        // Set up listeners.
        backgroundFetchRegistration.addEventListener('progress', this.progressHandler);
    }

    private progressHandler = () => {
        orchestrator.requestRender(this);
    }

    public render(): HTMLElement {
        const downloadedBytes = this.backgroundFetchRegistration.downloaded;
        const readableBytes = prettyBytes(downloadedBytes);
        return <div class="fetch-progress" data-fetch-id={this.backgroundFetchRegistration.id}>
            <strong>{this.backgroundFetchRegistration.id}</strong><br />
            {readableBytes}
        </div>;
    }
}

export const orchestrator = new FetchDisplayOrchestrator($('#progress'));
