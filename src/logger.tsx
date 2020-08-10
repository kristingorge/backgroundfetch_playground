import $ from "jquery";
import { h } from "tsx-dom";

// Logger to show all actions in the browser

const $logElement = $("#log");

export function log(...args: any[]) {
    // Turn args into the logged message.
    const message = args.map((arg: any) => {
        if (arg.constructor === String) {
            return arg as String;
        } else {
            return JSON.stringify(arg, null, 2);
        }
    }).join(" ");

    const messageElement = <div>
        <strong style="white-space: nowrap">{(new Date).toISOString()}</strong>
        :&nbsp;
        <code><pre style="overflow-wrap: anywhere">{message}</pre></code>
    </div >;

    $logElement.prepend(messageElement);
}