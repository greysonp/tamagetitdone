module TGD {
    export class Action {
        
        constructor(animator:TGD.Animation, properties?:Object) {
        }

        run(callback:()=>void, properties?:Object) {
            callback();
        }
    }
}