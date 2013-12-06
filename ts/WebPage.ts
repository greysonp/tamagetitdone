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
                // TGD.Util.log("Pulled from storage.");
                TGD.Util.log(results);          

                // If this is the first domain we've ever visited, initialize the data
                if (Object.keys(results).length === 0) {
                    TGD.Util.log("Initializing data for the first time.")
                    results = {
                        "domains": {},
                        "categories": WebPage.generateDefaultCategories()
                    }
                }
                // Otherwise, grab the data inside the root key
                else {
                    results = results["pages"];
                }

                // If we haven't visited this domain before, we have to grab the categories
                // and give it an initial p value (0.5, just to stay neutral).
                if (!results["domains"][domain]) {
                    TGD.Util.log("Never visited. Retrieving categories.");                    
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
                        this.storeAllData();
                        callback();
                    });
                }
                // Otherwise, we can just keep reference to the data we already had
                else {
                    TGD.Util.log("Visited before. Can use the data we already have.");
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
                if (!data["categories"][categories[i]]) {
                    data["categories"][categories[i]] = {
                        "p": 0.5
                    }
                }
            }
        }

        /**
         * Updates local storage with the data item we have stored.
         */
        private storeAllData():void {
            TGD.Util.log("Storing data.");
            TGD.Util.log(this.storedData);
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
            var p:number = this.storedData["domains"][this.domain]["p"];

            var categories = this.storedData["domains"][this.domain]["categories"];
            var sum:number = 0;
            for (var i = 0; i < categories.length; i++) {
                sum += this.storedData["categories"][categories[i]]["p"];
            }

            if (categories.length > 0) {
                var avgCat = sum / categories.length;
                return (p + avgCat) / 2;
            }
            return p;
        }

        public taskCompleted(isDirect:boolean):void {
            // Make sure to get updated data before altering and storing new data.
            // We could have completed tasks in other tabs in the meantime.

        }

        public static generateDefaultCategories():Object {
            return {
                "Academic Fraud": { "p": 0.0 },
                "Adult Themes": { "p": 0.4 },
                "Alcohol": { "p": 0.5 },
                "Anime/Manga/Webcomic": { "p": 0.1 },
                "Automotive": { "p": 0.2 },
                "Blogs": { "p": 0.6 },
                "Business Services": { "p": 0.8 },
                "Content Delivery Networks": { "p": 0.6 },
                "Dating": { "p": 0.9 },
                "Educational Institutions": { "p": 1.0 },
                "File Storage": { "p": 1.0 },
                "Forums/Message boards": { "p": 0.7 },
                "Games": { "p": 0.1 },
                "Government": { "p": 1.0 },
                "Humor": { "p": 0.1 },
                "Jobs/Employment": { "p": 1.0 },
                "Lingerie/Bikini": { "p": 0.1 },
                "Movies": { "p": 0.1 },
                "Music": { "p": 0.2 },
                "News/Media": { "p": 0.6 },
                "Non-Profits": { "p": 1.0 },
                "Nudity": { "p": 0.1 },
                "P2P/File sharing": { "p": 0.1 },
                "Photo Sharing": { "p": 0.6 },
                "Pornography": { "p": 0.0 },
                "Politics": { "p": 1.0 },
                "Research/Reference": { "p": 1.0 },
                "Search Engines": { "p": 0.9 },
                "Sexuality": { "p": 0.1 },
                "Social Networking": { "p": 0.1 },
                "Software/Technology": { "p": 0.6 },
                "Sports": { "p": 0.2 },
                "Tasteless": { "p": 0.0 },
                "Video Sharing": { "p": 0.3 }
            };
        }
    }
}