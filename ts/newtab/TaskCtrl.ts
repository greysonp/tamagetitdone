///<reference path="../d/DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="../d/DefinitelyTyped/chrome/chrome.d.ts" />
///<reference path="../d/DefinitelyTyped/angularjs/angular.d.ts" />
///<reference path="../d/DefinitelyTyped/underscore/underscore.d.ts" />
///<reference path="../d/DefinitelyTyped/sugar/sugar.d.ts" />
///<reference path="Task.ts" />

var app = angular.module("newTab", ["ngSanitize"])
    .config( [
        "$compileProvider",
        function($compileProvider) {   
            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|chrome):/);
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|chrome):/);
        }
    ]);

// Controller
function TaskCtrl($scope) {
    // =================================================
    // INITIALIZATION
    // =================================================
    $scope.selectedTag = -1;
    $scope.tasks = []
    chrome.storage.local.get("tasks", function(data) {
        if (data["tasks"])
            for (var i = 0; i < data["tasks"].length; i++)
                $scope.tasks.push(NewTab.Task.createFromStoredObject(data["tasks"][i]))
        $scope.tasks.sort(taskSort);

        $scope.$apply();
    });

    $scope.init = function() {
        resize();
        $(window).resize(resize);
        for (var i = 0; i < $scope.tasks.length; i++) {
            $scope.tasks[i].isEdit = false;
            $scope.tasks[i].isVisible = true;
        }
        $(".panel-center").on("click", "a.tag", function() {
            $scope.filterTag($(this).text().substring(1), true);
        });
    }

    // =================================================
    // EVENTS
    // =================================================
    $scope.inputKeyDown = function($event) {
        if ($event.keyCode === 13)
            $scope.addTask();
    }

    // =================================================
    // TASK MANAGEMENT
    // =================================================
    $scope.deleteTask = function($event, $index):void {
        $scope.tasks.splice($index, 1);
        storeTasks();
    }

    $scope.toggleComplete = function($event, task):void {
        task.isComplete = !task.isComplete;
        storeTasks();
    }
    
    $scope.addTask = function($event):void {
        // We don't do anything if there's nothing in the text box
        var $text = $("#js-newtask-text");
        if ($text.val().length <= 0)
            return;

        // Create a new task and add it to the list
        var tags = parseTags($text.val());
        var date = parseDate($text.val());
        console.log(date);
        var task:NewTab.Task = new NewTab.Task(getTaggedString($text.val()), tags, date);
        $scope.tasks.unshift(task);
        $scope.tasks.sort(taskSort);
        storeTasks();

        // Clear out the text
        $text.val("");
    }

    $scope.editTask = function($event, task):void {
        task.title = getUntaggedString(task.title);
        task.isEdit = true;
    }

    $scope.finishTaskEdit = function($event, task):void {
        // This event is run for both a blur event and a keydown, so we have a little
        // check here for that
        if (!$event.keyCode || ($event.keyCode && $event.keyCode === 13)) {
            task.title = getTaggedString($event.target.value);
            task.tags = parseTags($event.target.value);
            task.date = parseDate($event.target.value);
            task.isEdit = false;
            $scope.tasks.sort(taskSort);
            storeTasks();
        }
    }

    $scope.focusInput = function():void {
        $(".panel-center li input").focus();
        $(".panel-center li input").select();
    }

    $scope.getTagList = function():string[] {
        var out:string[] = [];
        for (var i = 0; i < $scope.tasks.length; i++) {
            out = _.union(out, $scope.tasks[i].tags);
        }
        for (var i = 0; i < out.length; i++) {
            out[i] = "#" + out[i];
        }

        out.sort();
        return out;
    }

    $scope.filterTag = function(tag:string, apply:boolean, index:number):void {
        if (tag.charAt(0) == '#')
            tag = tag.substring(1);
        if (typeof(index) === "undefined") {
            index = getIndexOfTag(tag);
        }
        $scope.selectedTag = index;

        for (var i = 0; i < $scope.tasks.length; i++) {
            var t:NewTab.Task = $scope.tasks[i];
            if (_.indexOf(t.tags, tag) < 0) {
                t.isVisible = false;
            }
            else {
                t.isVisible = true;
            }
        }
        if (apply) {
            $scope.$apply();
        }
    }

    $scope.clearFilter = function():void {
        $scope.selectedTag = -1;
        for (var i = 0; i < $scope.tasks.length; i++) {
            $scope.tasks[i].isVisible = true;
        }
    }

    // =================================================
    // HELPERS
    // =================================================
    function storeTasks():void {
        var stored:Object[] = [];
        var workLevel:number = 0;
        for (var i = 0; i < $scope.tasks.length; i++) {
            var date = $scope.tasks[i].date;
            if (date)
                date = date.toString();
            var obj:Object = {
                "title": $scope.tasks[i].title,
                "tags": $scope.tasks[i].tags,
                "date": date 
            };
            stored.push(obj);
            if (!$scope.tasks[i].isComplete)
                workLevel += getTaskValue($scope.tasks[i]);
        }
        workLevel = Math.min(workLevel, 1);

        chrome.storage.local.set({"tasks":stored});  
        chrome.storage.local.set({"workLevel": workLevel});
        console.log("workLevel: " + workLevel);
    }

    function getTaskValue(task:NewTab.Task):number {
        if (!task.date)
            return 0.1;

        var now:Date = new Date();
        var until:number = Math.max(task.date.getTime() - now.getTime(), 0);
        var minutesUntil:number = until/1000/60;

        // var workLevel:number = Math.E^((1440 - minutesUntil)/( (2880/Math.log(10) - 720/Math.log(2))/1440 * (minutesUntil - 2880) + 720/Math.log(2) ));
        var workLevel = Math.pow(1440, 1.4)/Math.pow(minutesUntil, 1.4);
        return Math.min(workLevel, 1);
    }

    function parseDate(text:string):Date {
        var words:string[] = text.split(' ');
        var biggestLength:number = 0;
        var returnDate:Date = null;
        for (var i = 0; i < words.length; i++) {
            for (var j = i; j < words.length; j++) {
                var test:string = concatWordsToString(words, i, j);
                var date:Date = Date["future"](test);
                if (date.toString() != "Invalid Date" && test.length > biggestLength) {
                    biggestLength = test.length;
                    returnDate = date;
                }
            }
        }
        if (returnDate.getTime() - new Date().getTime() < 0) {
            return new Date();
        }

        return returnDate;
    }

    function concatWordsToString(words:string[], start:number, end:number) {
        var output:string = "";
        for (var i = start; i <= end; i++) {
            output += words[i];
            if (i != end)
                output += ' ';
        }
        return output;
    }

    function parseTags(text:string):string[] {
        var tags:string[] = [];
        var tokens:string[] = text.split(' ');

        // Go through all of the tokens and keep the ones that start with
        // a hash tag (but strip it off before we store it)
        for (var i = 0; i < tokens.length; i++)
            if (tokens[i].charAt(0) == '#')
                tags.push(tokens[i].substring(1));

        return tags;
    }

    function getIndexOfTag(tag:string):number {
        if (tag.charAt(0) != '#') {
            tag = '#' + tag;
        }
        var items:string[] = $scope.getTagList();
        for (var i = 0; i < items.length; i++) {
            if (tag == items[i])
                return i;
        }
    }

    function getTaggedString(text):string {
        var regex:RegExp = new RegExp("#[a-z|A-Z|0-9]+", "g");
        text = text.replace(regex, "<a href='#' class='tag'>$&</a>");
        return text;
    }

    function getUntaggedString(text):string {
        var regex:RegExp = new RegExp("<a[\\s\\S]+?>", "g");
        text = text.replace(regex, "");

        regex = new RegExp("</a>", "g");
        text = text.replace(regex, "");

        return text;
    }

    function taskSort(a:NewTab.Task, b:NewTab.Task) {
        if (!a.date && !b.date)
            return 1;
        if(a.date && !b.date)
            return -1;
        if (b.date && !a.date)
            return 1;
        return b.date < a.date;
    }

    function resize():void {
        var sum = 0;
        var marginLeft = 0;
        var $left = $("#js-panel-left");
        var $right = $("#js-panel-right");
        var $center = $("#js-panel-center");

        if ($left.is(":visible")) {
            sum += $left.width();
            marginLeft = $left.width();
        }
        if ($right.is(":visible")) {
            sum += $right.width();
        }

        $center.css("width", (window.innerWidth - sum) + "px");
        $center.css("margin-left", marginLeft + "px");
    }
}