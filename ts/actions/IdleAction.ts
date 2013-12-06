 module TGD {
    export class IdleAction extends Action {

        private $tgd;
        private time:number;
        private animation:TGD.Animation;
        private timeoutId:number;

        constructor(animation:TGD.Animation, properties?:Object) {
            super(animation, properties);
            if (typeof properties !== "undefined")
                this.time = properties["time"];
            else
                this.time = 1000;
            this.animation = animation;
            this.$tgd = $("#tgd");

            this.actionCode = Action.IDLE;
        }

        public run(callback:()=>void, properties?:Object) {
            this.animation.idle();
            var dist = TGD.Util.getDistanceFromRest();
            if (dist > 0) {
                this.$tgd.animate({
                top: TGD.Tommy.getTopOffset(),
                left: TGD.Main.restingX
                }, dist, "swing", () => {
                    // Make sure it's at the bottom - we may have scrolled
                    // while Tommy was animating
                    this.$tgd.css({
                        top: TGD.Tommy.getTopOffset(),
                        left: TGD.Main.restingX
                    });
                });    
            }
            this.timeoutId = setTimeout(function() {
                if (callback) 
                    callback();
            }, this.time);
        }

        public stop() {
            super.stop();
            if (this.timeoutId)
                clearTimeout(this.timeoutId);

        }
    }
}