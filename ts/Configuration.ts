module TGD {
    export class Configuration {
        private static storage:TGD.IStorage;
        
        public static init() {
            if (typeof Configuration.storage === "undefined") 
                Configuration.storage = new TGD.ChromeStorage();
        }


        // ===================================
        // Night Start Time
        // ===================================        
        public static getNightStartHour(callback:(number)=>void):void {
            Configuration.storage.get("nightStartHour", (val:string) => {
                callback(parseInt(val));    
            });
        }
        public static setNightStartHour(value:string, callback?:()=>void):void {
            Configuration.storage.set({"nightStartHour": value}, callback);
        }

        // ===================================
        // Night End Time
        // ===================================
        public static getNightEndHour(callback:(number)=>void):void {
            Configuration.storage.get("nightEndHour", (val:string) => {
                callback(parseInt(val));    
            })
        }
        public static setNightEndHour(value:string, callback?:()=>void):void {
            Configuration.storage.set({"nightEndHour": value}, callback);

        }
    }
}

TGD.Configuration.init();