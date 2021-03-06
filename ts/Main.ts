///<reference path="d/DefinitelyTyped/tsd.d.ts" />
///<reference path="IStorage.ts" />
///<reference path="ChromeStorage.ts" />
///<reference path="Tommy.ts" />
///<reference path="QTable.ts" />

module TGD {    
    export class Main {

        // Graphics stuff
        public static stage:createjs.Stage;
        public static FPS:number = 30;
        public static restingX:number = 0;

        // State variables
        public static page:TGD.WebPage;

        // References to important objects
        private tommy:TGD.Tommy;

        // AI stuff
        private qTable:TGD.QTable;
        private lastAction:TGD.ActionInfo;

        constructor() {
            // Add Tommy to the stage
            $("body").append('<canvas id="tgd" width="100" height="100" style="position: absolute; bottom: 0px; left: 0px; z-index: 55555"></canvas>');
            $("body").append('<div id="bottom-marker" style="position:fixed; bottom:0; background-color:blue"></div>');

            // Initialize createjs
            Main.stage = new createjs.Stage("tgd");
            createjs.Ticker.addEventListener("tick", (e) => {
                this.tick.call(this, e);
            });
            createjs.Ticker.setFPS(Main.FPS);
            createjs.Ticker.useRAF = true;

            // Initialize our modules
            var storage:TGD.IStorage = new TGD.ChromeStorage();
            storage.get("restingX", (data) => {
                if (data.restingX) Main.restingX = data.restingX;
                TGD.Util.log(data);
                this.qTable = new TGD.QTable(() => {
                    this.tommy = new TGD.Tommy(() => {
                        Main.page = new TGD.WebPage(document.domain, () => {
                            this.init();
                        });
                    });    
                });
            });
        }

        private init():void {
            this.getCurrentState((state) => {
                this.lastAction = this.qTable.getAction(state);
                this.tommy.performAction(this.lastAction.actionCode);
                this.initEvents();
            });
        }

        private initEvents() {
            this.tommy.addEventListener(TGD.Tommy.ACTIONS_DONE, () => {
                this.step();
            });
            
            this.tommy.addEventListener(TGD.Tommy.MOUSE_DOWN, () => {
                this.tommy.startDrag();
                $("body").on("mouseup", () => {
                    this.tommy.stopDrag();
                    $("body").off("mouseup");
                });
            });
        }

        private step():void {
            this.getCurrentState((state) => {
                this.lastAction.callback(1, state);
                this.lastAction = this.qTable.getAction(state);
                TGD.Util.log(this.lastAction.actionCode);
                this.tommy.performAction(this.lastAction.actionCode);
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
                Main.page = new TGD.WebPage(document.domain, () => {
                    workLevel = data["workLevel"];
                    prodLevel = Main.page.getProductivityRating();
                    var state = new TGD.State(0.5, prodLevel, workLevel);
                    callback(state);
                });        
            });
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
