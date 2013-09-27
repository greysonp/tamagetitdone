///<reference path="d/DefinitelyTyped/easeljs/easeljs.d.ts" />
///<reference path="d/DefinitelyTyped/chrome/chrome.d.ts" />
///<reference path="IStorage.ts" />
///<reference path="ChromeStorage.ts" />
///<reference path="Tommy.ts" />

module TGD {    
    export class Main {

        public static stage:createjs.Stage;

        public static FPS:number = 30;
        private useageTime:number = 0;
        private domain:string = window.location.host;

        //Action Variables
        private activeRadius:number = 240; //radius around mouse that will trigger eat()

        //Timer Maximums
        private weakMax:number = 8; //seconds until weak hunger
        private strongMax:number = 16; //strong hunger
        private starveMax:number = 5; //seconds until tamagotchi will start eating things beyond the activeRadius
        private timeSinceMeal:number = 0; //seconds since the tamagotchi last ate

        private hungerLevel:number = 0; //hunger level (0 = not hungry, 1 = weak, 2 = strong)

        //Clock Maximums (for sleeping)
        private bedtimeHour:number = 23; //11PM
        private wakeupHour:number = 8 //8AM
        private asleep:boolean = false;

        private timer:TGD.Timer;

        private storage:TGD.IStorage;
        private tommy:TGD.Tommy;

        private static self:Main;

        //Hungry Websites
        private sites:string[] = ["www.reddit.com", "www.youtube.com", "www.facebook.com", "www.twitter.com", "www.techcrunch.com", "www.stumbleupon.com",
            "www.commitsfromlastnight.com", "www.tumblr.com", "www.memebase.com", "www.pinterest.com", "localhost"];

        constructor() {
            $("body").append('<canvas id="tgd" width="150" height="150" style="position: absolute; bottom: 0px; left: 0px; z-index: 55555"></canvas>');
            $("body").append('<div id="bottom-marker" style="position:fixed; bottom:0; background-color:blue"></div>');

            // Initialize createjs
            Main.stage = new createjs.Stage("tgd");
            createjs.Ticker.addEventListener("tick", this.tick);
            createjs.Ticker.setFPS(Main.FPS);
            createjs.Ticker.useRAF = true;

            this.storage = new TGD.ChromeStorage();
            Main.self = this;

            // Initialize our modules
            this.tommy = new TGD.Tommy(() => {
                if (this.contains(this.sites, this.domain))
                    this.timer = new TGD.Timer(() => {
                        this.timerCallback.apply(this);
                    });
                else
                    TGD.Util.log("Domain is not unproductive: " + this.domain);
            });
            
        }

        private timerCallback():void {
            if (!this.checkSleep()){
                this.timer.getTime((time:number) => {
                    this.timer.saveTime();
                    this.useageTime = time;
                    this.storage.set({"hungerLevel": this.hungerLevel}, null); // store hunger level
                    this.checkHunger();
                });
            }
        }

        private checkHunger():void  {
            if (this.useageTime < this.weakMax) { // idle
                TGD.Util.log("Satisfied.");
                if (this.hungerLevel != 0) {
                    //do idle animation
                    this.tommy.idle();
                    this.hungerLevel = 0;
                }
            }
            else if (this.useageTime >= this.weakMax && this.useageTime < this.strongMax) {
                this.hungerLevel = 1;
                TGD.Util.log("Weak Hunger.");

                // do weak animation
                this.tommy.eatWeak(this.activeRadius, () => {
                   this.tommy.idle();
                });


            }
            else if (this.useageTime >= this.strongMax) {
                this.hungerLevel = 2;
                TGD.Util.log("Strong Hunger!");

                //do strong animation
                var hasEaten = this.tommy.eat(this.activeRadius, () => {
                    // Could send a callback to idle, but you don't have to
                    this.tommy.idle();
                }, false);

                //if tamagotchi is starving (hasn't eaten in a while), force it to eat something even if it is
                //outside the active radius of the cursor
                if (!hasEaten)
                    this.timeSinceMeal += 1;
                if (this.timeSinceMeal >= this.starveMax) {
                    TGD.Util.log("Starving!!!");
                    this.tommy.eat(9999999, () => {
                        // Could send a callback to idle, but you don't have to
                        this.tommy.idle();
                    }, true);
                    this.timeSinceMeal = 0;
                }
            }
        }

        private checkSleep():boolean {
            var curTime = new Date();
            var curHour = curTime.getHours();

            //Between the hours of sleep and wake
            if ((curHour >= this.bedtimeHour && curHour <= 24) || (curHour >= 0 && curHour < this.wakeupHour)) {
                if (!this.asleep) {
                    TGD.Util.log("Going to bed.");
                    this.tommy.idle(() => {
                        this.tommy.goToBed();
                    });
                    this.timer.resetTimer();
                    this.asleep = true;
                }
            }
            else if (this.asleep) {
                //do wakeUp
                this.timer.resetTimer();
                this.asleep = false;
            }
            return this.asleep;
        }

        public static isAsleep():boolean {
            return Main.self.asleep;
        }

        public tick():void {
            Main.stage.update();
        }

        private contains(a, obj):boolean {
            for (var i = 0; i < a.length; i++)
                if (a[i] === obj)
                    return true;
            return false;
        }
    }
}

var main:TGD.Main = new TGD.Main();
