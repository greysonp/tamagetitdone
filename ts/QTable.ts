///<reference path="IStorage.ts" />
///<reference path="ChromeStorage.ts" />

module TGD {
    export class QTable {
        // Constants
        public static STORAGE_KEY:string = "qTable";

        // Object references
        private table:Object = {};
        private storage:TGD.IStorage;

        constructor(callback) {
            this.storage = new TGD.ChromeStorage();

            this.storage.get(QTable.STORAGE_KEY, (data:Object) => {
                // if (Object.keys(data).length === 0) {
                //     this.initTable();
                // }
                // else {
                //     this.table = data[QTable.STORAGE_KEY];
                // }
                // this.initTable();
                // TGD.Util.log(this.table);
                callback();
            });
        }

        private initTable() {
            for (var f = 0; f <= 1; f += 1/TGD.State.F_RANGE.length) {
                for (var p = 0; p <= 1; p += 1/TGD.State.P_RANGE.length) {
                    for (var w = 0; w <= 1; w += 1/TGD.State.W_RANGE.length) {
                        var state:TGD.State = new TGD.State(f, p, w);
                        var key = state.toString();
                        this.table[key] = this.generateRandomArray(2);
                    }
                }
            }
            this.flush();
        }

        /**
         * Chooses an action based on the given state variables.
         * @type {[type]}
         */
        public getAction(state:TGD.State):TGD.ActionInfo {
            // Grab our stuff from the QTable
            var key = state.toString();
            var actionCode:number = this.chooseAction(key);
            var cb = (val:number, state2:TGD.State) => {
                // this.reward(key, actionCode, val, state2);
            }
            return new TGD.ActionInfo(actionCode, cb);
        }

        /**
         * Rewards an state/action combination a specified amount.
         * 
         * Implements the Q-Learning algorithm found at:
         * http://webdocs.cs.ualberta.ca/~sutton/book/ebook/node65.html
         */
        private reward(stateKey:string, actionCode:number, reward:number, state:TGD.State):void {
            // The value of the action just taken
            var prevQ:number = this.table[stateKey][actionCode];

            // The value of the best possible action that comes from the state the prev action got us to
            var nextStateKey:string = state.toString();
            var maxQ:number = this.table[nextStateKey][this.getMaxAction(nextStateKey)];

            // [0,1]: As this approaches 1, each reward is considered more important and influencial
            var learningRate:number = 0.2;

            // [0,1]: As this approaches 0, Tommy becomes more short-sighted
            var discountRate:number = 0.9;

            // Update our Q value with the new one
            this.table[stateKey][actionCode] = prevQ + learningRate * (reward + discountRate * maxQ - prevQ);

            /**
             * Check if we are ever going above 1 or below -1. Cap it for now, but keep track of how often
             * we go out of bounds. We don't want to lose that experience. In the future, we can cap, but
             * then scale all other values to keep the relative importance of this action.
             */
        }


        /**
         * Given a state key, this will choose an action from the
         * QTable, returning the action code of the action chosen.
         *
         * Could use various algorithms, but right now it is always
         * choosing the option with the highest value, with a percent
         * chance that it will choose randomly based on how dominant
         * the max option is.
         */
        private chooseAction(stateKey:string):number {
            // var maxIndex:number = 0;
            // var rowSum:number = 0;
            // var a:number[] = this.table[stateKey];
            // for (var i = 0; i < a.length; i++) {
            //     rowSum += a[i];
            //     if (a[i] > a[maxIndex]) {
            //         maxIndex = i;
            //     }
            // }

            // // What percentage of the row the dominant action has
            // var dominance:number = a[maxIndex] / rowSum;

            // // Example: if dominance is 70% but we roll a 85%, then
            // // we'll just pick a random action. We'll likely have a 
            // // lot of very dominant actions, so by doing this, we mix it
            // // up a bit.
            // if (Math.random() > dominance)
            //     return Math.floor(Math.random() * a.length);
            // else
            //     return maxIndex;

            var state:TGD.State = TGD.State.buildFromString(stateKey);
            TGD.Util.log("state: " + state.p + "  " + state.w);

            // Do nothing if asleep
            if (TGD.Tommy.isAsleep)
                return TGD.Action.IDLE

            // Give different actions depending on workload
            if (state.w > 0.75 && state.p < 0.5) {
                if (new Date().getHours() < 4) {
                    return TGD.Action.LIGHTS_OUT;
                }
                return TGD.Action.EAT;
            }
            return TGD.Action.IDLE;
        }

        /**
         * Gets the action with the highest Q-Value for a given state.
         */
        private getMaxAction(stateKey:string):number {
            var maxIndex:number = 0;
            var a:number[] = this.table[stateKey];
            for (var i = 0; i < a.length; i++) {
                if (a[i] > a[maxIndex]) {
                    maxIndex = i;
                }
            }
            return i;
        }

        /**
         * Generates a random array of a specified length, putting in
         * values for each index in the range [0, 1]
         * @type {[type]}
         */
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