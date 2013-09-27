module TGD {
    export interface Storage {
        set(object:Object, callback:()=>void):void;
        get(key:String, callback:(string)=>void):void;
    }
}