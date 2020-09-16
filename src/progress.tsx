import prettyBytes from 'pretty-bytes';
import { h } from "tsx-dom";
import $ from "jquery";
import { DownloadableState } from './downloadable_item';
import { ItemStatus } from './item_status';

class FetchDisplayOrchestrator {
    private downloadStateBars: DownloadStateBar[] = [];

    constructor(private $container: JQuery) { }

    public addDownloadStateBar(fetch: DownloadStateBar) {
        this.downloadStateBars.push(fetch);
        this.requestRender(fetch);
    }

    public render() {
        return <div id="all-fetch-progresses-container">
            {this.downloadStateBars.map(fetch => this.renderSingle(fetch))}
        </div>;
    }

    public mount() {
        this.$container.append(this.render());
    }

    renderSingle(fetch: DownloadStateBar) {
        return <div class="fetch-progress-container"
            data-fetch-progress-container-id={fetch.id}>
            {fetch.render()}
        </div>;
    }

    public requestRender(fetch: DownloadStateBar) {
        if (this.downloadStateBars.indexOf(fetch) === -1) {
            return;
        }

        const $fetchContainer = this.$container
            .find(`div[data-fetch-progress-container-id=${fetch.id}]`);

        if ($fetchContainer.length > 0) {
            $fetchContainer.eq(0).children().eq(0).replaceWith(fetch.render());
        }
        else {
            this.$container.prepend(this.renderSingle(fetch));
        }
    }
}

export class DownloadStateBar {
    constructor(public readonly download: DownloadableState) { }

    get id() {
        return this.download.itemId;
    }

    public render(): HTMLElement {
        const pct = (100.0 * this.download.downloadedPct).toFixed(2);
        return <div class="fetch-progress" data-item-id={this.download.itemId}>
            {this.download.status === ItemStatus.DOWNLOADING
                ? <a href="javascript:;" class="abort-button" onClick={() => this.download.fetchRegistration!.abort()}>&times;</a>
                : null}
            <strong>{this.download.itemId}</strong><br />
            {prettyBytes(this.download.backgroundFetch?.downloaded || 0)} / {prettyBytes(this.download.backgroundFetch?.downloadTotal || 0)}<br />
            {pct}%<br />
            {this.download.status}{this.download.backgroundFetch?.failureReason ? `, ${this.download.backgroundFetch?.failureReason}` : ''}<br />
            <small>
                Started At: {this.download.startedAt?.toString()}<br />
                Completed At: {this.download.completedAt?.toString()}
            </small>
        </div>;
    }
}

export const orchestrator = new FetchDisplayOrchestrator($('#progress'));
