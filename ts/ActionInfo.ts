module TGD {
    export class ActionInfo {

        public actionCode:number;
        public callback:(code:number, state:TGD.State)=>void;

        constructor(actionCode:number, callback:(code:number, state:TGD.State)=>void) {
            this.callback = callback;
            this.actionCode = actionCode;
        }
    }
}