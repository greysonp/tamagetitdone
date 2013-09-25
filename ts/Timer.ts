module TGD {
    export class Timer {
        private tid;
        private t:number = 0;
        private domain:string = "";
        private started:boolean = false;
        private isActive:boolean = true;
        private timer;
        private cb;
        private storage:TGD.Storage;

        constructor (callback) {
            this.cb = callback;
            this.domain = window.location.host;
            this.storage = new TGD.StorageChrome();
            var _this:Timer = this;

            //Check if timer already exists
            this.getTime(function(prevTime:number) {
                if (prevTime != null && !isNaN(prevTime))
                    this.t = prevTime;
                else
                    this.t = 0;    
            });
            

            //Start timer
            this.tid = setInterval(function () {
                _this.myTimer();
                if (_this.isActive)
                    _this.cb();
            }, 1000); //initialize timer
            this.started = true; //timer flag

            // Add window focus events
            window.onfocus = function () {
                _this.isActive = true;
            }

            window.onblur = function () {
                _this.isActive = false;
            }
        }

        private myTimer():void {
            if (this.isActive)
                this.t = this.t + 1;
        }

        public resetTimer():void {
            this.t = 0;
        }

        public resetTime():void {
            this.storage.set(this.domain, this.t.toString(), null);
        }

        public getTime(callback:(number)=>void):void {
            this.storage.get(this.domain, function(value:string) {
                callback(parseInt(value));
            });
        }

        public saveTime():void {

        }
    }
}




