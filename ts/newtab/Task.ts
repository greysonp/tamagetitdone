module NewTab {
    export class Task {
        public title:string;
        public tags:string[];
        public isEdit:boolean;
        public isComplete:boolean;
        public isVisible:boolean;

        constructor(title:string, tags:string[] = []) {
            this.title = title;
            this.tags = tags;
            this.isEdit = false;
            this.isComplete = false;
            this.isVisible = true;
        }
    }
}