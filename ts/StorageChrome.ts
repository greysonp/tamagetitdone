///<reference path="d/DefinitelyTyped/chrome/chrome.d.ts" />

module TGD {
    export class StorageChrome implements TGD.Storage {
        public set(key:String, value:String, callback:()=>void):void {
            if (callback !== null)
                chrome.storage.local.set(key, callback);
            else
                chrome.storage.local.set(key);
        }

        public get(key:String, callback:(string)=>void):void {
            chrome.storage.local.get(key, callback);
        }
    }
}