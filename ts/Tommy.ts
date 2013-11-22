///<reference path="d/DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="d/DefinitelyTyped/jqueryui/jqueryui.d.ts" />

module TGD {
    export class Tommy {
        // Mouse x and y position
        private mouseX:number;
        private mouseY:number;
        
        // A reference to our animator
        private animation:TGD.Animation;

        // List of actions
        private actionList:TGD.Action[];
        private listenerMap:Object;

        // Event Constants
        public static ACTIONS_DONE:string = "actionsdone";

        /**
         * Creates a new Tommy manager.
         * @param   {Function}  A callback that will be executed when initialization
         *                      is done.
         */
        constructor(callback:()=>void) {
            this.animation = new TGD.Animation(() => {
                this.init(callback);
            });
        }

        public init(callback:()=>void):void {
            this.actionList = [];
            this.listenerMap = {};

            var $tgd = $('#tgd');
            $tgd.css("top", Tommy.getTopOffset());

            // Track mouse position
            $(document).mousemove((e) => {
                this.mouseX = e.pageX;
                this.mouseY = e.pageY;
            });

            // Reposition on scroll if not moving
            $(document).scroll(() => {
                if (!this.isActive() || (this.actionList[0].actionCode === TGD.Action.IDLE && !$tgd.is(':animated')))
                    $tgd.css("top", Tommy.getTopOffset());
            });

            // Reposition on browser resize if not moving
            $(window).resize(() => {
                if (!this.isActive())
                    $tgd.css("top", Tommy.getTopOffset());
            });
            callback();
        }

        // ==========================================
        // ACTION FACTORIES
        // ==========================================
        
        public performAction(actionCode:number) {
            switch(actionCode) {
                case TGD.Action.IDLE:
                    this.idle();
                    break;
                case TGD.Action.EAT:
                    this.eat();
                    break;
            }
        }
        
        public eat() {
            var action:TGD.EatAction = new TGD.EatAction(this.animation, {
                "mouseX": this.mouseX,
                "mouseY": this.mouseY
            }); 

            this.actionList.push(action);
            if (this.actionList.length <= 1)
                this.nextAction();
        }

        public idle() {
            var action:TGD.IdleAction = new TGD.IdleAction(this.animation); 

            this.actionList.push(action);
            if (this.actionList.length <= 1)
                this.nextAction();
        }

        // ==========================================
        // ACTION QUEUE
        // ==========================================
        private nextAction() {
            if (this.actionList.length > 0) {
                this.actionList[0].run(() => {
                    this.actionList.shift();
                    this.nextAction();    
                }, {
                    "mouseX": this.mouseX,
                    "mouseY": this.mouseY    
                });
            }
            else {
                this.trigger(Tommy.ACTIONS_DONE);
            }
        }

        public isActive() {
            return this.actionList.length > 0;
        }

        // ==========================================
        // EVENT MANAGEMENT
        // ==========================================
        public addEventListener(eventName:string, callback:()=>void):void {
            // Initialize array if this is the first listener for this event
            var list:()=>void[] = this.listenerMap[eventName];
            if (list == null || typeof list === "undefined")
                this.listenerMap[eventName] = [];

            // Add the listener to the list
            this.listenerMap[eventName].push(callback);
        }

        private trigger(eventName:string):void {
            var list:()=>void[] = this.listenerMap[eventName];
            if (list == null || typeof list === "undefined")
                return;

            for (var i = 0; i < list.length; i++) {
                var c = list[i];
                c();
            }
        }

        // ==========================================
        // STATIC METHODS
        // ==========================================

        public static setPosition():void {
            var $tgd = $('#tgd');
            var x:number = $tgd.offset().left;
            var y:number = $tgd.offset().top;

            $tgd.css("left", x).css("top", y);
        }

        public static getTopOffset():number {
            return $("#bottom-marker").offset().top - $('#tgd').height();
        }

    }
}
