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
        private lastAction:TGD.ActionInfo;



        constructor() {
            // Add Tommy to the stage
            $("body").append('<canvas id="tgd" width="150" height="150" style="position: absolute; bottom: 0px; left: 0px; z-index: 55555"></canvas>');
            $("body").append('<div id="bottom-marker" style="position:fixed; bottom:0; background-color:blue"></div>');

            // Initialize createjs
            Main.stage = new createjs.Stage("tgd");
            createjs.Ticker.addEventListener("tick", (e) => {
                this.tick.call(this, e);
            });
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
            this.getCurrentState((state) => {
                this.lastAction = this.qTable.getAction(state);
                this.tommy.performAction(this.lastAction.actionCode);
                this.tommy.addEventListener(TGD.Tommy.ACTIONS_DONE, () => {
                    this.step();
                });
            });
            // this.tommy.performAction(this.lastAction["actionCode"]);
            // this.tommy.eat();
            // this.tommy.idle();
        }

        private step():void {
            this.getCurrentState((state) => {
                // console.log(state);
                this.lastAction.callback(1, state);
                this.lastAction = this.qTable.getAction(state);
                this.tommy.performAction(this.lastAction.actionCode);
                // console.log("Chose action: " + this.lastAction.actionCode);
            });
        }

        /**
         * Generates a State object based on several factors
         */
        private getCurrentState(callback:(state:TGD.State)=>void):void {
            var storage:IStorage = new ChromeStorage();

            var workLevel:number = 0;
            var funLevel:number = 0;
            var prodLevel:number = 0;
            storage.get("workLevel", (data:Object) => {
                workLevel = data["workLevel"];
                callback(new TGD.State(0.5, 0.5, workLevel));
            });
        }

        public tick():void {
            Main.stage.update();
            // console.log(this.tommy.isActive());
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
