module NewTab {
    export class Task {
        public title:string;
        public tags:string[];
        public isComplete:boolean;

        constructor(title:string, tags:string[] = []) {
            this.title = title;
            this.tags = tags;
            this.isComplete = false;
        }
    }
}