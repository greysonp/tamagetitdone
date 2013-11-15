 module TGD {
    export class IdleAction extends Action {

        private $tgd;
        private time:number;
        private animation:TGD.Animation;

        constructor(animation:TGD.Animation, properties?:Object) {
            super(animation, properties);
            if (typeof properties !== "undefined")
                this.time = properties["time"];
            else
                this.time = 1000;
            this.animation = animation;
            this.$tgd = $('#tgd');

            this.actionCode = Action.IDLE;
        }

        public run(callback:()=>void, properties?:Object) {
            this.animation.idle();
            // this.$tgd.animate({
            //     top: TGD.Tommy.getTopOffset(),
            //     left: 0
            // }, this.time, "swing", () => {
            //     // Make sure it's at the bottom - we may have scrolled
            //     // while Tommy was animating
            //     this.$tgd.css({
            //         top: TGD.Tommy.getTopOffset(),
            //         left: 0
            //     });
            //     if (callback != null)
            //         callback();
            // });
            setTimeout(function() {
                if (callback) 
                    callback();
            }, this.time);
        }
    }
}