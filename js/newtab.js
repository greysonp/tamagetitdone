var NewTab;
(function (NewTab) {
    var Task = (function () {
        function Task(title, tags) {
            if (typeof tags === "undefined") { tags = []; }
            this.title = title;
            this.tags = tags;
        }
        return Task;
    })();
    NewTab.Task = Task;
})(NewTab || (NewTab = {}));
///<reference path="../d/DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="../d/DefinitelyTyped/chrome/chrome.d.ts" />
///<reference path="../d/DefinitelyTyped/handlebars/handlebars.d.ts" />
///<reference path="Task.ts" />
$(document).ready(init);
var _listTemplate;
var _tasks = [];

// =================================================
// INITIALIZATION
// =================================================
function init() {
    getStoredData(function () {
        resize();
        initList();
        initEvents();
    });
}

function initList() {
    _listTemplate = Handlebars.compile($("#js-panel-center").html());
    updateList();
}

function initEvents() {
    // Window resize
    $(window).resize(resize);

    // Add task enter press
    $("#js-panel-center").on("keydown", "#js-newtask-text", function (e) {
        if (e.keyCode === 13)
            addTask();
    });

    // Add task button press
    $("#js-panel-center").on("click", "#js-newtask-btn", addTask);
}

function getStoredData(callback) {
    chrome.storage.local.get("tasks", function (data) {
        _tasks = data["tasks"] || [];
        callback();
    });
}

// =================================================
// TASK MANAGEMENT
// =================================================
function addTask() {
    // We don't do anything if there's nothing in the text box
    var $text = $("#js-newtask-text");
    if ($text.val().length <= 0)
        return;

    // Create a new task and add it to the list
    var task = new NewTab.Task($text.val());
    _tasks.unshift(task);
    storeTasks();
    updateList();

    // Clear out the text
    $text.val("");
}

function updateList() {
    var context = { "tasks": _tasks };
    var compiledHtml = _listTemplate(context);
    $("#js-panel-center").html(compiledHtml);

    // Give focus back to textbox
    $("#js-newtask-text").focus();
}

function storeTasks() {
    console.log("Storing task.");
    chrome.storage.local.set({ "tasks": _tasks });
}

// =================================================
// EVENTS
// =================================================
function resize() {
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
//# sourceMappingURL=newtab.js.map
