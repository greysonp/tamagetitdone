module TGD {
    export class Util {
        public static log(text:string, isError:boolean = false):void {
            if (!isError)
                console.info(text);
        }
    }
}