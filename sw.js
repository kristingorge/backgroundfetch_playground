parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"oCke":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.r=v,exports.w=I,exports.u=exports.i=exports.a=void 0;const e=(e,t)=>t.some(t=>e instanceof t);let t,r;function n(){return t||(t=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function o(){return r||(r=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}exports.i=e;const s=new WeakMap,i=new WeakMap,a=new WeakMap,c=new WeakMap,u=new WeakMap;function p(e){const t=new Promise((t,r)=>{const n=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{t(I(e.result)),n()},s=()=>{r(e.error),n()};e.addEventListener("success",o),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&s.set(t,e)}).catch(()=>{}),u.set(t,e),t}function f(e){if(i.has(e))return;const t=new Promise((t,r)=>{const n=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{t(),n()},s=()=>{r(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)});i.set(e,t)}exports.a=u;let d={get(e,t,r){if(e instanceof IDBTransaction){if("done"===t)return i.get(e);if("objectStoreNames"===t)return e.objectStoreNames||a.get(e);if("store"===t)return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return I(e[t])},set:(e,t,r)=>(e[t]=r,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function v(e){d=e(d)}function D(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?o().includes(e)?function(...t){return e.apply(B(this),t),I(s.get(this))}:function(...t){return I(e.apply(B(this),t))}:function(t,...r){const n=e.call(B(this),t,...r);return a.set(n,t.sort?t.sort():[t]),I(n)}}function m(t){return"function"==typeof t?D(t):(t instanceof IDBTransaction&&f(t),e(t,n())?new Proxy(t,d):t)}function I(e){if(e instanceof IDBRequest)return p(e);if(c.has(e))return c.get(e);const t=m(e);return t!==e&&(c.set(e,t),u.set(t,e)),t}const B=e=>u.get(e);exports.u=B;
},{}],"yvr6":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.deleteDB=n,exports.openDB=t,Object.defineProperty(exports,"unwrap",{enumerable:!0,get:function(){return e.u}}),Object.defineProperty(exports,"wrap",{enumerable:!0,get:function(){return e.w}});var e=require("./wrap-idb-value.js");function t(t,n,{blocked:r,upgrade:o,blocking:d,terminated:a}={}){const i=indexedDB.open(t,n),s=(0,e.w)(i);return o&&i.addEventListener("upgradeneeded",t=>{o((0,e.w)(i.result),t.oldVersion,t.newVersion,(0,e.w)(i.transaction))}),r&&i.addEventListener("blocked",()=>r()),s.then(e=>{a&&e.addEventListener("close",()=>a()),d&&e.addEventListener("versionchange",()=>d())}).catch(()=>{}),s}function n(t,{blocked:n}={}){const r=indexedDB.deleteDatabase(t);return n&&r.addEventListener("blocked",()=>n()),(0,e.w)(r).then(()=>void 0)}const r=["get","getKey","getAll","getAllKeys","count"],o=["put","add","delete","clear"],d=new Map;function a(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(d.get(t))return d.get(t);const n=t.replace(/FromIndex$/,""),a=t!==n,i=o.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!i&&!r.includes(n))return;const s=async function(e,...t){const r=this.transaction(e,i?"readwrite":"readonly");let o=r.store;a&&(o=o.index(t.shift()));const d=await o[n](...t);return i&&await r.done,d};return d.set(t,s),s}(0,e.r)(e=>({...e,get:(t,n,r)=>a(t,n)||e.get(t,n,r),has:(t,n)=>!!a(t,n)||e.has(t,n)}));
},{"./wrap-idb-value.js":"oCke"}],"qNa8":[function(require,module,exports) {
"use strict";var e,t;Object.defineProperty(exports,"__esModule",{value:!0}),exports.BackgroundFetchResult=exports.BackgroundFetchFailureReason=void 0,exports.BackgroundFetchFailureReason=e,function(e){e[e[""]=0]="",e[e.aborted=1]="aborted",e[e["bad-status"]=2]="bad-status",e[e["fetch-error"]=3]="fetch-error",e[e["quota-exceeded"]=4]="quota-exceeded",e[e["download-total-exceeded"]=5]="download-total-exceeded"}(e||(exports.BackgroundFetchFailureReason=e={})),exports.BackgroundFetchResult=t,function(e){e.InProgress="",e.Success="success",e.Failure="failure"}(t||(exports.BackgroundFetchResult=t={}));
},{}],"xxT1":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ITEMS=exports.MULTI=exports.SINGLE=void 0;const t={id:"single",segments:["https://bitmovin-a.akamaihd.net/content/MI201109210084_1/video/720_2400000/dash/segment_0.m4s"],totalSize:1434989};exports.SINGLE=t;let e=[];for(let i=0;i<50;i++)e.push(`https://bitmovin-a.akamaihd.net/content/MI201109210084_1/video/720_2400000/dash/segment_${i}.m4s`);const s={id:"multi",segments:e,totalSize:61626553};exports.MULTI=s;const o={[t.id]:t,[s.id]:s};exports.ITEMS=o;
},{}],"QHgf":[function(require,module,exports) {
"use strict";var t;Object.defineProperty(exports,"__esModule",{value:!0}),exports.ItemStatus=void 0,exports.ItemStatus=t,function(t){t.NOT_DOWNLOADED="not_downloaded",t.DOWNLOADING="downloading",t.FAILED="failed",t.DOWNLOADED="downloaded"}(t||(exports.ItemStatus=t={}));
},{}],"OCIv":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getServiceWorkerRegistration=t,exports.setServiceWorkerRegistration=r,exports.getBackgroundFetchManager=n;let e=null;function t(){return e}function r(t){e=t}function n(){return e.backgroundFetch}
},{}],"ugoS":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.DownloadableState=void 0;var t=require("./background_fetch"),e=require("./sample_downloadable_items"),s=require("./db"),i=require("./item_status"),o=require("./background_fetch_manager"),r=function(t,e,s,i){return new(s||(s=Promise))(function(o,r){function n(t){try{d(i.next(t))}catch(e){r(e)}}function a(t){try{d(i.throw(t))}catch(e){r(e)}}function d(t){var e;t.done?o(t.value):(e=t.value,e instanceof s?e:new s(function(t){t(e)})).then(n,a)}d((i=i.apply(t,e||[])).next())})};class n extends EventTarget{constructor(t){super(),t&&(this.itemId=t.id,this.status=i.ItemStatus.NOT_DOWNLOADED,this.startedAt=null,this.completedAt=null,this.fetchRegistration=null,this.backgroundFetch=null)}get downloadedPct(){return this.backgroundFetch?this.backgroundFetch.downloaded/this.backgroundFetch.downloadTotal:0}get item(){return e.ITEMS[this.itemId]}startDownload(){return r(this,void 0,void 0,function*(){this.startedAt=new Date;const t=yield(0,o.getBackgroundFetchManager)().fetch(this.item.id,this.item.segments,{downloadTotal:this.item.totalSize,title:this.item.id});this.fetchRegistration=t,this.addFetchListeners(t),(0,s.store)(this)})}abortDownload(){return r(this,void 0,void 0,function*(){if(!this.fetchRegistration)throw"no fetch registration!";yield this.fetchRegistration.abort(),this.status=i.ItemStatus.NOT_DOWNLOADED,this.backgroundFetch=null,(0,s.store)(this)})}retryDownload(){return r(this,void 0,void 0,function*(){this.startedAt=null,this.fetchRegistration=null,this.startDownload()})}addFetchListeners(t){t.addEventListener("progress",e=>this.updateFromRegistration(t))}updateFromRegistration(e){e.result==t.BackgroundFetchResult.InProgress?this.status=i.ItemStatus.DOWNLOADING:e.result==t.BackgroundFetchResult.Success?(this.status=i.ItemStatus.DOWNLOADED,this.completedAt||(this.completedAt=new Date)):e.result==t.BackgroundFetchResult.Failure&&(this.status=i.ItemStatus.FAILED),this.backgroundFetch={downloadTotal:e.downloadTotal,downloaded:e.downloaded,result:e.result,failureReason:e.failureReason},this.dispatchEvent(new Event("requestrender")),(0,s.store)(this)}fromStorageDocument(t,e,s){this.itemId=e.itemId,this.status=e.status,this.startedAt=e.startedAt,this.completedAt=e.completedAt,this.fetchRegistration=s,this.backgroundFetch=e.backgroundFetch,s&&this.addFetchListeners(s),this.dispatchEvent(new Event("requestrender"))}idbStorageKey(){return this.itemId}toStorageDocument(){return{itemId:this.itemId,fetchId:null==this.fetchRegistration?null:this.fetchRegistration.id,status:this.status,startedAt:this.startedAt,completedAt:this.completedAt,backgroundFetch:this.backgroundFetch}}}exports.DownloadableState=n;
},{"./background_fetch":"qNa8","./sample_downloadable_items":"xxT1","./db":"jjUS","./item_status":"QHgf","./background_fetch_manager":"OCIv"}],"jjUS":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.get=u,exports.getAll=l,exports.openDb=s,exports.store=a,exports.storeSegment=f;var e=o(require("idb")),t=require("./downloadable_item"),n=require("./background_fetch_manager");function r(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return r=function(){return e},e}function o(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=r();if(t&&t.has(e))return t.get(e);var n={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){var u=o?Object.getOwnPropertyDescriptor(e,i):null;u&&(u.get||u.set)?Object.defineProperty(n,i,u):n[i]=e[i]}return n.default=e,t&&t.set(e,n),n}var i=function(e,t,n,r){return new(n||(n=Promise))(function(o,i){function u(e){try{l(r.next(e))}catch(t){i(t)}}function c(e){try{l(r.throw(e))}catch(t){i(t)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(u,c)}l((r=r.apply(e,t||[])).next())})};function u(e){return i(this,void 0,void 0,function*(){const t=yield s(),n=yield t.get("items",e);return t.close(),n?yield c(e,n):null})}function c(e,r){return i(this,void 0,void 0,function*(){const o=null==r.fetchId?null:yield(0,n.getBackgroundFetchManager)().get(r.fetchId),i=new t.DownloadableState;return i.fromStorageDocument(e,r,o),i})}function l(){return i(this,void 0,void 0,function*(){const e=yield s(),t=yield e.getAll("items");return e.close(),Promise.all(t.map(e=>c(e.itemId,e)))})}const d="db";function s(){return i(this,void 0,void 0,function*(){return yield e.openDB(d,1,{upgrade(e){e.createObjectStore("items").createIndex("by-fetch-id","fetchId"),e.createObjectStore("segments")}})})}function a(e){return i(this,void 0,void 0,function*(){const t=yield s();yield t.put("items",e.toStorageDocument(),e.idbStorageKey()),t.close()})}function f(e,t){return i(this,void 0,void 0,function*(){const n=yield s();yield n.put("segments",t,e),n.close()})}
},{"idb":"yvr6","./downloadable_item":"ugoS","./background_fetch_manager":"OCIv"}],"pBGv":[function(require,module,exports) {

var t,e,n=module.exports={};function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===r||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}function u(t){if(e===clearTimeout)return clearTimeout(t);if((e===o||!e)&&clearTimeout)return e=clearTimeout,clearTimeout(t);try{return e(t)}catch(n){try{return e.call(null,t)}catch(n){return e.call(this,t)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:r}catch(n){t=r}try{e="function"==typeof clearTimeout?clearTimeout:o}catch(n){e=o}}();var c,s=[],l=!1,a=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):a=-1,s.length&&h())}function h(){if(!l){var t=i(f);l=!0;for(var e=s.length;e;){for(c=s,s=[];++a<e;)c&&c[a].run();a=-1,e=s.length}c=null,l=!1,u(t)}}function m(t,e){this.fun=t,this.array=e}function p(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];s.push(new m(t,e)),1!==s.length||l||i(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0};
},{}],"A5OK":[function(require,module,exports) {
var process = require("process");
var e=require("process"),t=i(require("./db")),n=require("./background_fetch_manager");function o(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return o=function(){return e},e}function i(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=o();if(t&&t.has(e))return t.get(e);var n={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var a=i?Object.getOwnPropertyDescriptor(e,r):null;a&&(a.get||a.set)?Object.defineProperty(n,r,a):n[r]=e[r]}return n.default=e,t&&t.set(e,n),n}var r=function(e,t,n,o){return new(n||(n=Promise))(function(i,r){function a(e){try{d(o.next(e))}catch(t){r(t)}}function l(e){try{d(o.throw(e))}catch(t){r(t)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(a,l)}d((o=o.apply(e,t||[])).next())})};function a(e){return r(this,void 0,void 0,function*(){const t=yield self.clients.matchAll({type:"window"});for(const n of t)n.postMessage(e)})}function l(e){return r(this,void 0,void 0,function*(){yield a({eventType:e.type,id:e.registration.id,downloaded:e.registration.downloaded,downloadTotal:e.registration.downloadTotal,uploaded:e.registration.uploaded,uploadTotal:e.registration.uploadTotal,failureReason:e.registration.failureReason})})}self.addEventListener("install",e=>{e.waitUntil(self.skipWaiting())}),self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim())}),self.addEventListener("backgroundfetchclick",e=>{e.waitUntil(l(e))}),self.addEventListener("backgroundfetchsuccess",e=>r(void 0,void 0,void 0,function*(){const o=e.registration;(0,n.getServiceWorkerRegistration)()||(0,n.setServiceWorkerRegistration)(self.registration);e.waitUntil((()=>r(void 0,void 0,void 0,function*(){const n=yield o.matchAll();yield Promise.all(n.map(e=>r(void 0,void 0,void 0,function*(){try{const o=yield e.responseReady,i=yield o.arrayBuffer();console.log(`Storing segment: ${o.url}`),yield t.storeSegment(o.url,i),yield a(`Stored data for ${o.url.substring(o.url.length-20)}`)}catch(n){return console.error("No response for "+e.request.url+": "+n.message),Promise.resolve(null)}}))),console.log("updating download state to complete"),(yield t.get(o.id)).updateFromRegistration(o),console.log("sending background fetch success event"),l(e)}))())})),self.addEventListener("backgroundfetchfail",e=>r(void 0,void 0,void 0,function*(){e.waitUntil(l(e))})),self.addEventListener("backgroundfetchabort",e=>r(void 0,void 0,void 0,function*(){e.waitUntil(l(e))}));
},{"./db":"jjUS","./background_fetch_manager":"OCIv","process":"pBGv"}]},{},["A5OK"], null)
//# sourceMappingURL=/backgroundfetch_playground/sw.js.map