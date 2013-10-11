///<reference path="d/DefinitelyTyped/easeljs/easeljs.d.ts" />
///<reference path="d/DefinitelyTyped/chrome/chrome.d.ts" />
///<reference path="IStorage.ts" />
///<reference path="ChromeStorage.ts" />
///<reference path="Tommy.ts" />
///<reference path="QTable.ts" />

module TGD {    
    export class Main {

        // Graphics stuff
        public static stage:createjs.Stage;
        public static FPS:number = 30;

        // State variables
        private page:TGD.WebPage;

        // References to important objects
        private tommy:TGD.Tommy;

        // AI stuff
        private qTable:TGD.QTable;
        private lastAction:Object;



        constructor() {
            // Add Tommy to the stage
            $("body").append('<canvas id="tgd" width="150" height="150" style="position: absolute; bottom: 0px; left: 0px; z-index: 55555"></canvas>');
            $("body").append('<div id="bottom-marker" style="position:fixed; bottom:0; background-color:blue"></div>');

            // Initialize createjs
            Main.stage = new createjs.Stage("tgd");
            createjs.Ticker.addEventListener("tick", this.tick);
            createjs.Ticker.setFPS(Main.FPS);
            createjs.Ticker.useRAF = true;

            // Initialize our modules
            this.qTable = new TGD.QTable(() => {
                this.tommy = new TGD.Tommy(() => {
                    this.page = new TGD.WebPage(window.location.href, () => {
                        this.init();    
                    });
                });    
            });
        }

        private init():void {
            this.tommy.addEventListener(TGD.Tommy.ACTIONS_DONE, () => {
                this.step();
            });
            this.lastAction = this.qTable.getAction(this.getCurrentState());
            // this.tommy.performAction(this.lastAction["actionCode"]);
            // this.tommy.eat();
            // this.tommy.idle();
        }

        private step():void {
            this.lastAction["callback"](1, this.getCurrentState());
            this.lastAction = this.qTable.getAction(this.getCurrentState());
            this.tommy.performAction(this.lastAction["actionCode"]);
            console.log("Chose action: " + this.lastAction["actionCode"]);
        }

        /**
         * Generates a State object based on several 
         */
        private getCurrentState():TGD.State {
            return new TGD.State(0.5, 0.5, 0.5);
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
