///<reference path="../d/DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="../d/DefinitelyTyped/chrome/chrome.d.ts" />
///<reference path="../d/DefinitelyTyped/angularjs/angular.d.ts" />
///<reference path="Task.ts" />

var app = angular.module("newTab", [])
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
        var task:NewTab.Task = new NewTab.Task($text.val());
        $scope.tasks.unshift(task);
        storeTasks();

        // Clear out the text
        $text.val("");
    }

    // =================================================
    // HELPERS
    // =================================================
    function storeTasks():void {
        chrome.storage.local.set({"tasks":$scope.tasks});
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