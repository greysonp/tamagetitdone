module TGD {
    export class WebPage {

        public domain:String;
        public isDark:boolean;
        public storage:TGD.IStorage;
        private storedData:any;
        private categories:string[];


        public static STORAGE_KEY:string = "pages";

        /**
         * Constructs a new WebPage from a domain. If this domain has been
         * visited already, then it will restore it from saved data.
         */
        constructor(domain:string, callback:()=>void) {
            // Store the domain
            if (domain.indexOf("http://") > -1) {
                domain = domain.substring(7);
            }
            else if (domain.indexOf("https://") > -1) {
                domain = domain.substring(8);
            }
            this.domain = domain;

            // Check to see if we have data on this domain
            this.storage = new TGD.ChromeStorage();
            this.storage.get(WebPage.STORAGE_KEY, (results) => {
                console.log(results);          

                // If this is the first domain we've ever visited, initialize the data
                if (Object.keys(results).length === 0) {
                    console.log("Initializing data for the first time.")
                    results = {
                        "domains": {},
                        "categories": {}
                    }
                }
                // Otherwise, grab the data inside the root key
                else {
                    results = results["pages"];
                }

                // If we haven't visited this domain before, we have to grab the categories
                // and give it an initial p value (0.5, just to stay neutral).
                if (!results["domains"][domain]) {
                console.log("Never visited. Retrieving categories.");                    
                    this.retrieveCategories((error, categories) => {
                        if (!error) {
                            results["domains"][domain] = {
                                "categories": categories,
                                "p": 0.5
                            }
                            // Make sure that if there are categories that haven't been accounted
                            // for yet that they get added in
                            this.initCategories(results, categories);
                        }
                        this.storedData = results;
                        this.storeData();
                    });
                }
                // Otherwise, we can just keep reference to the data we already had
                else {
                    console.log("Visited before. Can use the data we already have.");
                    this.storedData = results;
                    callback();
                }
            });
        }

        /**
         * Gets a list of categories for a domain using the OpenDNS API I made.
         */
        private retrieveCategories(callback:(string, any)=>void):void {
            $.get("http://tamagetitdone.herokuapp.com/api/v1/categories/" + this.domain, (results) => {
                if (results.error) {
                    callback(results.error, null);
                }
                else {
                    callback(null, results.categories);
                }
            });
        }

        /**
         * Initializes the categories in our "categories" storage if necessary.
         * Gives a p value of 0.5 to start to be fair.
         */
        private initCategories(data:any, categories:string[]):void {
            for (var i = 0; i < categories.length; i++) {
                if (!this.storedData["categories"][categories[i]]) {
                    this.storedData["categories"][categories[i]] = {
                        "p": 0.5
                    }
                }
            }
        }

        /**
         * Updates local storage with the data item we have stored.
         */
        private storeData():void {
            console.log("Storing data.");
            console.log(this.storedData);
            var obj = {};
            obj[WebPage.STORAGE_KEY] = this.storedData;
            this.storage.set(obj);
        }

        /**
         * Gets the productivity rating for this webpage based on various
         * criteria.
         * @return [number]
         *         A number between 0.0-1.0, where 1 is the most productive.
         */
        public getProductivityRating():number {
            var p:number = this.storeData["domains"][this.domain]["p"];

            var categories = this.storedData["domains"][this.domain]["categories"];
            var sum:number = 0;
            for (var i = 0; i < categories.length; i++) {
                sum += this.storeData["categories"][categories[i]]["p"];
            }
            var avgCat = sum / categories.length;
            return (p + avgCat) / 2;
        }

        public taskCompleted(isDirect:boolean):void {
            // Make sure to get updated data before altering and storing new data.
            // We could have completed tasks in other tabs in the meantime.

        }
    }
}