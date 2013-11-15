module TGD {
    export class State {

        // Value of state variables
        public f:number;
        public p:number;
        public w:number;

        // Constants referring to state variable ranges
        public static F_RANGE:number[] = [.25, .5, .75, 1];
        public static P_RANGE:number[] = [.25, .5, .75, 1];
        public static W_RANGE:number[] = [.25, .5, .75, 1];

        constructor(f:number, p:number, w:number) {
            this.f = f;
            this.p = p;
            this.w = w;
        }

        public static buildFromString(s:string) {
            var vals = s.split("|");
            var f = State.F_RANGE[vals[0]];
            var p = State.P_RANGE[vals[1]];
            var w = State.W_RANGE[vals[2]];
            return new State(f, p, w);
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

        public toString():string {
            var f2 = this.getBucketValue(this.f, State.F_RANGE);
            var p2 = this.getBucketValue(this.p, State.P_RANGE);
            var w2 = this.getBucketValue(this.w, State.W_RANGE);
            return f2 + "|" + p2 + "|" + w2;
        }
    }
}