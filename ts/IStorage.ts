module TGD {
    export interface IStorage {
        set(object:Object, callback?:()=>void):void;
        get(key:String, callback:(string)=>void):void;
    }
}