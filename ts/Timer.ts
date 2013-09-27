///<reference path="IStorage.ts" />
///<reference path="ChromeStorage.ts" />

module TGD {
    export class Timer {
        private tid;
        private t:number = 0;
        private domain:string = "";
        private started:boolean = false;
        private isActive:boolean = true;
        private timer;
        private cb;
        private storage:TGD.IStorage;

        constructor (callback) {
            this.cb = callback;
            this.domain = window.location.host;
            this.storage = new TGD.ChromeStorage();

            //Check if timer already exists
            this.getTime(function(prevTime:number) {
                if (prevTime != null && !isNaN(prevTime))
                    this.t = prevTime;
                else
                    this.t = 0;    
            });
            

            //Start timer
            this.tid = setInterval(() => {
                this.myTimer();
                if (this.isActive)
                    this.cb();
            }, 1000); //initialize timer
            this.started = true; //timer flag

            // Add window focus events
            window.onfocus = () => {
                this.isActive = true;
            }

            window.onblur = () => {
                this.isActive = false;
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
            var obj:Object = {};
            obj[this.domain] = this.t;
            this.storage.set(obj);
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




