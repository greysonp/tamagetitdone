module TGD {
    export interface Storage {
        set(key:String, value:String, callback:()=>void):void;
        get(key:String, callback:(string)=>void):void;
    }
}