module NewTab {
    export class Task {
        public title:string;
        public tags:string[];
        public isEdit:boolean;
        public isComplete:boolean;
        public isVisible:boolean;
        public date:Date;

        constructor(title:string, tags:string[] = [], date:Date = null) {
            this.title = title;
            this.tags = tags;
            this.isEdit = false;
            this.isComplete = false;
            this.isVisible = true;
            this.date = date;
        }

        public static createFromStoredObject(obj:Object) {
            var date = null;
            if (obj["date"]) date = new Date(obj["date"].toString());
            return new Task(obj["title"], obj["tags"], date);
        }
    }
}