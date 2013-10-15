///<reference path="../d/DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="../d/DefinitelyTyped/chrome/chrome.d.ts" />
///<reference path="../d/DefinitelyTyped/handlebars/handlebars.d.ts" />
///<reference path="Task.ts" />
$(document).ready(init);
var _listTemplate;
var _tasks:NewTab.Task[] = [];

// =================================================
// INITIALIZATION
// =================================================

function init() {
    getStoredData(function() {
        resize();
        initList();
        initEvents();    
    });
}

function initList():void {
    _listTemplate = Handlebars.compile($("#js-tasklist").html());
    updateList();
}

function initEvents():void {
    // Window resize
    $(window).resize(resize);

    // Add task enter press
    $("#js-panel-center").on("keydown", "#js-newtask-text", function(e) {
        if (e.keyCode === 13)
            addTask();
    });

    // Add task button press
    $("#js-newtask-btn").click(addTask);
}

function initTaskEvents() {
    $("#js-tasklist li").each(function(index) {
        $(this).find(".delete-btn").click(function(){
            _tasks.splice(index, 1);
            storeTasks();
            updateList();
        });
        $(this).find(".checkbox").click(function() {
            _tasks[index].isComplete = !_tasks[index].isComplete;
            storeTasks();
            updateList(); 
        });
    });
}

function getStoredData(callback):void {
    chrome.storage.local.get("tasks", function(data) {
        _tasks = data["tasks"] || [];
        callback();    
    });
}

// =================================================
// TASK MANAGEMENT
// =================================================

function addTask():void {
    // We don't do anything if there's nothing in the text box
    var $text = $("#js-newtask-text");
    if ($text.val().length <= 0)
        return;

    // Create a new task and add it to the list
    var task:NewTab.Task = new NewTab.Task($text.val());
    _tasks.unshift(task);
    storeTasks();
    updateList();

    // Clear out the text
    $text.val("");
}

function updateList():void {
    var compiledHtml = _listTemplate({"tasks": _tasks});
    $("#js-tasklist").html(compiledHtml);

    // Give focus back to textbox
    $("#js-newtask-text").focus();
    initTaskEvents();
}

function toggleComplete():void {

}

function storeTasks():void {
    chrome.storage.local.set({"tasks":_tasks});
}

// =================================================
// EVENTS
// =================================================

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
