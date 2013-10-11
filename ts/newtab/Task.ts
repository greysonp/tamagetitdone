module NewTab {
    export class Task {
        public title:string;
        public tags:string[];

        constructor(title:string, tags:string[] = []) {
            this.title = title;
            this.tags = tags;
        }
    }
}