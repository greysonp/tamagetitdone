module TGD {
    export class Action {

        public static IDLE:number = 0;
        public static EAT:number = 1;
        public static LIGHTS_OUT:number = 2;
        public static NUM_ACTIONS:number = 3;
        public actionCode:number;

        constructor(animation:TGD.Animation, properties?:Object) {
        }

        public run(callback:()=>void, properties?:Object) {
            callback();
        }

        public stop() {
            $('#tgd').stop(true);
            TGD.Util.log("stopped");
        }
    }
}