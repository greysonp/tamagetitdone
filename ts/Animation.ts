///<reference path="d/DefinitelyTyped/easeljs/easeljs.d.ts" />

module TGD {
    export class Animation {

        private spritesheet:createjs.SpriteSheet;
        private sprite:createjs.Sprite;

        constructor(callback:()=>void = null) {
            this.spritesheet = new createjs.SpriteSheet({
                "animations": {
                    "idle": {"frames": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
                    "eat": {"frames": [2, 2, 5, 5, 6, 6]},
                    "run": {"frames": [2, 2, 2, 3, 3, 3, 4, 4, 4]},
                    "eat_h": {"frames": [7, 7, 8, 8, 9, 9, 9]},
                    "all": {"frames": [0]}},
                "images": [chrome.extension.getURL("img/placeholder_anim.png")],
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
            if (!this.spritesheet.complete) {
                this.spritesheet.addEventListener("complete", () => {
                    this.finishInit(callback);
                });
            }
            else {
                this.finishInit(callback);
            }
        }

        private finishInit(callback:()=>void):void {
            this.sprite = new createjs.Sprite(this.spritesheet);
            this.idle();
            TGD.Main.stage.addChild(this.sprite);
            if (callback != null)
                callback();
        }

        public idle():void {
            this.sprite.gotoAndPlay("idle");
        }

        public run():void {
            this.sprite.gotoAndPlay("run");
        }

        public eat(flipped:boolean) {
            if (flipped)
                this.sprite.gotoAndPlay("eat_h");
            else
                this.sprite.gotoAndPlay("eat");
        }

    }
}
