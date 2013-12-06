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
        public static CLICK:string = "click";
        public static MOUSE_DOWN:string = "mousedown";
        public static MOUSE_UP:string = "mouseup";

        // Mouse Movement
        private prevX:number = -1;
        private prevY:number = -1;
        private vx:number = 0;
        private vy:number = 0;
        private freefallTimer:number = 0;

        private static WIDTH:number = 150;
        private static HEIGHT:number = 150;

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

            // Manage mouse clicks
            $tgd.click(() => {
                this.trigger(Tommy.CLICK);
            });
            $tgd.mousedown(() => {
                this.trigger(Tommy.MOUSE_DOWN);
            });
            $tgd.mouseup(() => {
                this.trigger(Tommy.MOUSE_UP);
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

        public startDrag() {
            $("body").on("mousemove", (e) => { this.onDrag(e); });
            if (this.isActive()) {
                this.actionList[0].stop();
                this.actionList = [];    
            }
        }

        public stopDrag() {
            $("body").off("mousemove");

            // Reset prevX and prevY so we don't have inconsistent values on the next drag
            this.prevX = -1;
            this.prevY = -1;

            // Enter freefall
            this.vx /= 2;
            this.vy /= 2;
            clearInterval(this.freefallTimer);
            this.freefallTimer = setInterval(() => { this.onFreefall(); }, 33);
        }

        private onDrag(e:any) {
            if (this.prevX > 0 && this.prevY > 0) {
                this.vx = e.pageX - this.prevX;
                this.vy = e.pageY - this.prevY;
                Tommy.setX(Tommy.getX() + this.vx);
                Tommy.setY(Tommy.getYAbsolute() + this.vy);
            }
            this.prevX = e.pageX;
            this.prevY = e.pageY;
        }

        private onFreefall() {
            var $tgd = $("#tgd");
            
            var x:number = Tommy.getX();
            var y:number = Tommy.getY();
            var friction:number = 0.8;
            var sideFriction:number = 0.6;

            // Take care of gravity
            var gravity:number = 8;
            this.vy += gravity;
            if (this.vy > 40) {
                this.vy = 40;
            }

            // Increment to our new position
            x += this.vx;
            y += this.vy;
        
            // Do bounds checking
            var screenWidth = $(window).width();
            var screenHeight = $(window).height();
            if (x + Tommy.WIDTH > screenWidth) {
                TGD.Util.log("bounce right");
                x = screenWidth - Tommy.WIDTH;
                this.vx *= -friction;
            }
            else if (x < 0) {
                TGD.Util.log("bounce left");
                x = 0;
                this.vx *= -friction;
            }
            if (y + Tommy.HEIGHT > screenHeight) {
                TGD.Util.log("bounce bottom: y: " + y + "  height: " + screenHeight);
                y = screenHeight - Tommy.HEIGHT;
                this.vy *= -friction;
                this.vx *= sideFriction;

            }
            else if (y < 0) {
                TGD.Util.log("bounce top: y: " + y + "  height: " + screenHeight);
                y = 0;
                this.vy *= -friction;
                this.vx *= sideFriction;
            }

            // Check if it's settled
            if (Math.abs(this.vx) < 0.25 && Math.abs(this.vy) < 0.25 && screenHeight - (y + Tommy.HEIGHT) < 5) {
                y = screenHeight - Tommy.HEIGHT;
                clearInterval(this.freefallTimer);
            }

            // Update our actual position            
            Tommy.setX(x);
            Tommy.setY(y);
        }

        // ==========================================
        // STATIC METHODS
        // ==========================================

        public static updateCSSPosition():void {
            var $tgd = $("#tgd");
            var x:number = $tgd.offset().left;
            var y:number = $tgd.offset().top;

            $tgd.css("left", x).css("top", y);
        }

        public static setX(x:number):void {
            $("#tgd").css("left", x);
        }

        public static setY(y:number):void {
            $("#tgd").css("top", y);
        }

        public static getX():number {
            return $("#tgd").offset().left;
        }

        public static getY():number {
            return $("#tgd").offset().top - $("body").scrollTop();
        }

        public static getYAbsolute():number {
            return $("#tgd").offset().top;
        }

        public static getTopOffset():number {
            return $("#bottom-marker").offset().top - $('#tgd').height();
        }

    }
}
