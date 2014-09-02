///<reference path="d/DefinitelyTyped/tsd.d.ts" />

module TGD {
    export class Animation {

        private spritesheet:createjs.SpriteSheet;
        private sprite:createjs.Sprite;

        constructor(callback:()=>void = null) {
            this.spritesheet = new createjs.SpriteSheet({
                "framerate":24,
                "images":[chrome.extension.getURL("img/animations.png")],
                "frames":[
                    [0, 0, 128, 128, 0, 0, -14],
                    [128, 0, 128, 128, 0, 0, -14],
                    [256, 0, 128, 128, 0, 0, -14],
                    [0, 128, 128, 128, 0, 0, -14],
                    [128, 128, 128, 128, 0, 0, -14],
                    [256, 128, 128, 128, 0, 0, -14],
                    [0, 256, 128, 128, 0, 0, -14],
                    [128, 256, 128, 128, 0, 0, -14],
                    [256, 256, 128, 128, 0, 0, -14],
                    [0, 384, 128, 128, 0, 0, -14],
                    [128, 384, 128, 128, 0, 0, -14]
                ],
                "animations":{
                    "eating_left": {
                        "speed": 1, 
                        "frames": [7, 7, 8, 8, 9, 9, 10, 10]
                    },
                    "eating_right": {
                        "speed": 1, 
                        "frames": [3, 3, 4, 4, 5, 5, 6, 6]
                    },
                    "idle": {
                        "speed": 1,
                        "frames": [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1]
                    }
                }
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
                this.sprite.gotoAndPlay("eating_left");
            else
                this.sprite.gotoAndPlay("eating_right");
        }

    }
}
