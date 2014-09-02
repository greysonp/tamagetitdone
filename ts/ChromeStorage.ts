///<reference path="d/DefinitelyTyped/tsd.d.ts" />

module TGD {
    export class ChromeStorage implements TGD.IStorage {
        public set(object:Object, callback?:()=>void):void {
            if (typeof callback !== "undefined")
                chrome.storage.local.set(object, callback);
            else
                chrome.storage.local.set(object);
        }

        public get(key:String, callback:(Object)=>void):void {
            chrome.storage.local.get(key, callback);
        }
    }
}