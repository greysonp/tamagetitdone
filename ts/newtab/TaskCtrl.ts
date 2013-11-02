///<reference path="../d/DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="../d/DefinitelyTyped/chrome/chrome.d.ts" />
///<reference path="../d/DefinitelyTyped/angularjs/angular.d.ts" />
///<reference path="../d/DefinitelyTyped/underscore/underscore.d.ts" />
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
    $scope.tasks = []
    chrome.storage.local.get("tasks", function(data) {
        $scope.tasks = data["tasks"] || [];
        $scope.$apply();
    });

    $scope.init = function() {
        resize();
        $(window).resize(resize);
        for (var i = 0; i < $scope.tasks.length; i++) {
            $scope.tasks[i].isEdit = false;
            $scope.tasks[i].isVisible = true;
        }
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
    $scope.deleteTask = function($event, $index) {
        $scope.tasks.splice($index, 1);
        storeTasks();
    }

    $scope.toggleComplete = function($event, task) {
        task.isComplete = !task.isComplete;
        storeTasks();
    }
    
    $scope.addTask = function($event) {
        // We don't do anything if there's nothing in the text box
        var $text = $("#js-newtask-text");
        if ($text.val().length <= 0)
            return;

        // Create a new task and add it to the list
        var tags = parseTags($text.val());
        var task:NewTab.Task = new NewTab.Task(getTaggedString($text.val()), tags);
        $scope.tasks.unshift(task);
        storeTasks();

        // Clear out the text
        $text.val("");
    }

    $scope.editTask = function($event, task) {
        task.title = getUntaggedString(task.title);
        task.isEdit = true;
    }

    $scope.finishTaskEdit = function($event, task) {
        // This event is run for both a blur event and a keydown, so we have a little
        // check here for that
        if (!$event.keyCode || ($event.keyCode && $event.keyCode === 13)) {
            task.title = getTaggedString($event.target.value);
            task.tags = parseTags($event.target.value);
            task.isEdit = false;
            storeTasks();
        }
    }

    $scope.focusInput = function() {
        $(".panel-center li input").focus();
        $(".panel-center li input").select();
    }

    // =================================================
    // HELPERS
    // =================================================
    function storeTasks():void {
        chrome.storage.local.set({"tasks":$scope.tasks}, function() {
            $(".content-scroll ul li .cell-center").each(function(index) {
                // $(this).html($scope.tasks[index].title);
            });    
        });
    }

    function parseTags(text):string[] {
        var tags:string[] = [];
        var tokens:string[] = text.split(' ');

        // Go through all of the tokens and keep the ones that start with
        // a hash tag (but strip it off before we store it)
        for (var i = 0; i < tokens.length; i++)
            if (tokens[i].charAt(0) == '#')
                tags.push(tokens[i].substring(1));

        return tags;
    }

    function getTaggedString(text):string {
        var regex:RegExp = new RegExp("#[a-z|A-Z|0-9]+", "g");
        console.log("before: " + text);
        text = text.replace(regex, "<a href='#' class='tag'>$&</a>");
        console.log("after: " + text);
        return text;
    }

    function getUntaggedString(text):string {
        var regex:RegExp = new RegExp("<a[\\s\\S]+?>", "g");
        text = text.replace(regex, "");

        regex = new RegExp("</a>", "g");
        text = text.replace(regex, "");

        return text;
    }

    function filterTag(tag:string):void {
        console.log(tag);
        for (var i = 0; i < $scope.tasks.length; i++) {
            var t:NewTab.Task = $scope.tasks[i];
            if (_.indexOf(t.tags, tag) < 0) {
                t.isVisible = false;
            }
        }
        $scope.$apply();
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