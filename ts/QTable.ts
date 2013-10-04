///<reference path="IStorage.ts" />
///<reference path="ChromeStorage.ts" />

module TGD {
    export class QTable {
        public static STORAGE_KEY:string = "qTable";
        private table:Object = {};
        private storage:TGD.IStorage;

        // Constants referring to the trifecta ranges
        private static F_RANGE:number[] = [.25, .5, .75, 1];
        private static P_RANGE:number[] = [.25, .5, .75, 1];
        private static W_RANGE:number[] = [.25, .5, .75, 1];

        // Action Constants

        constructor(callback) {
            this.storage = new TGD.ChromeStorage();

            this.storage.get(QTable.STORAGE_KEY, (data:Object) => {
                if (Object.keys(data).length === 0) {
                    this.initTable();
                }
                else {
                    this.table = data;
                }
                console.log(this.table);
                callback();
            });
        }

        private initTable() {
            for (var f = 0; f < QTable.F_RANGE.length; f ++) {
                for (var p = 0; p < QTable.P_RANGE.length; p++) {
                    for (var w = 0; w < QTable.W_RANGE.length; w++) {
                        var key = this.makeKey(QTable.F_RANGE[f], QTable.P_RANGE[p], QTable.W_RANGE[w]);
                        this.table[key] = this.generateRandomArray(2);
                    }
                }
            }
            this.flush();
        }

        public getAction(f:number, p:number, w:number) {
            
        }

        /**
         * Turns a set of fuzzy values into a key that we can use in table.
         */
        private makeKey(f:number, p:number, w:number):string {
            f = this.getBucketValue(f, QTable.F_RANGE);
            p = this.getBucketValue(p, QTable.P_RANGE);
            w = this.getBucketValue(w, QTable.W_RANGE);
            return f + "|" + p + "|" + w;
        }

        /**
         * We can't use any number between 0-1 to represent state because that would
         * result in far too many combinations. Instead, we convert a fuzzy value
         * into one of n distinct values. That's where the range comes in. The range
         * defines the different buckets we toss the value into.
         */
        private getBucketValue(value:number, range:number[]):number {
            var i = 0;
            while (value > range[i] && i < range.length) {
                i++;
            }
            return i;
        }

        private generateRandomArray(length:number):number[] {
            var a = [];
            for (var i = 0; i < length; i++) {
                a.push(Math.random());
            }
            return a;
        }

        /**
         * Saves our table to local storage for safekeeping.
         */
        private flush():void {
            var obj = {};
            obj[QTable.STORAGE_KEY] = this.table;
            this.storage.set(obj);
        }
    }   
}