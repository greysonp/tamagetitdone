module TGD {
    export class WebPage {

        public url:String;
        public isDark:boolean;
        public storage:TGD.IStorage;

        /**
         * Constructs a new WebPage from a URL. If this URL has been
         * visited already, then it will restore it from saved data.
         * @type {[type]}
         */
        constructor(url:string, callback:()=>void) {
            this.url = url;
            this.storage = new TGD.ChromeStorage();
            // this.storage.get("webpages", (results) => {
            //     var found:boolean = false;
            //     for (var i = 0; i < results.length && !found; i++) {
            //         if (results[i]["url"] === this.url) {
            //             this.setPropertiesFromObject(results[i]);
            //             found = true;
            //         }
            //     }
            //     if (!found)
            //         this.initProperties();

            //     callback();
            // });
            callback();
        }

        private initProperties() {

        }

        private setPropertiesFromObject(obj:Object):void {

        }

        /**
         * Gets the productivity rating for a webpage based on various
         * criteria.
         * @param page [TGD.WebPage]
         *        The page whose productivity rating you want to get.
         * @return [number]
         *         A number between 0.0-1.0, where 1 is the most productive.
         */
        public static getProductivityRating(page:TGD.WebPage):number {
            return 0.5;
        }
    }
}