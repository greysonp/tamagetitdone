///<reference path="d/DefinitelyTyped/easeljs/easeljs.d.ts" />

module TGD {
    export class Animation {

        private static spritesheet:createjs.SpriteSheet;
        private static sprite:createjs.BitmapAnimation;

        public static init(callback):void {
            Animation.spritesheet = new createjs.SpriteSheet({
                "animations": {
                    "idle": {"frames": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
                    "eat": {"frames": [2, 2, 5, 5, 6, 6]},
                    "run": {"frames": [2, 2, 2, 3, 3, 3, 4, 4, 4]},
                    "eat_h": {"frames": [7, 7, 8, 8, 9, 9, 9]},
                    "all": {"frames": [0]}},
                "images": ["http://www.greysonparrelli.com/tgd/placeholder_anim.png"],
                "frames": [[0, 0, 256, 256, 0, -3, -19],
                    [256, 0, 256, 256, 0, -3, -19],
                    [512, 0, 256, 256, 0, -3, -19],
                    [768, 0, 256, 256, 0, -3, -19],
                    [1024, 0, 256, 256, 0, -3, -19],
                    [1280, 0, 256, 256, 0, -3, -19],
                    [1536, 0, 256, 256, 0, -3, -19],
                    [1792, 0, 256, 256, 0, -3, -19],
                    [0, 256, 256, 256, 0, -3, -19],
                    [256, 256, 256, 256, 0, -3, -19]]
            });
            if (!Animation.spritesheet.complete) {
                Animation.spritesheet.addEventListener("complete", function() {
                    Animation.finishInit(callback);
                });
            }
            else {
                Animation.finishInit(callback);
            }
        }

        private static finishInit(callback:()=>void):void {
            Animation.sprite = new createjs.BitmapAnimation(Animation.spritesheet);
            Animation.idle();
            TGD.Main.stage.addChild(Animation.sprite);
            if (callback != null)
                callback();
        }

        public static idle():void {
            Animation.sprite.gotoAndPlay("idle");
        }

        public static run():void {
            Animation.sprite.gotoAndPlay("run");
        }

        public static eat(flipped:boolean) {
            if (flipped)
                Animation.sprite.gotoAndPlay("eat_h");
            else
                Animation.sprite.gotoAndPlay("eat");
        }

    }
}
