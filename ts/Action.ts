module TGD {
    export class Action {

        constructor(animation:TGD.Animation, properties?:Object) {
        }

        public run(callback:()=>void, properties?:Object) {
            callback();
        }

        public stop() {
            $('#tgd').stop();
        }
    }
}