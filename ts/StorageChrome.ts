///<reference path="d/DefinitelyTyped/chrome/chrome.d.ts" />

module TGD {
    export class StorageChrome implements TGD.Storage {
        public set(object:Object, callback:()=>void):void {
            if (callback !== null)
                chrome.storage.local.set(object, callback);
            else
                chrome.storage.local.set(object);
        }

        public get(key:String, callback:(string)=>void):void {
            chrome.storage.local.get(key, callback);
        }
    }
}