module TGD {
    export class Action {

        public static IDLE:number = 0;
        public static EAT:number = 1;
        public static NUM_ACTIONS:number = 2;

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