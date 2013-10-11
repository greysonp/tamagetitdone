///<reference path="../d/DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="../d/DefinitelyTyped/chrome/chrome.d.ts" />
///<reference path="../d/DefinitelyTyped/handlebars/handlebars.d.ts" />
$(document).ready(init);
var _listTemplate;

// =================================================
// INITIALIZATION
// =================================================
function init() {
    resize();
    initList();
    initEvents();
}

function initList() {
    _listTemplate = Handlebars.compile($("#js-panel-center").html());
    updateList();
}

function initEvents() {
    $(window).resize(resize);
}

// =================================================
// TASK MANAGEMENT
// =================================================
function addTask() {
    console.log("Task Added!");
}

function updateList() {
    var tasks = {
        "tasks": [
            {
                title: "Spider-Man"
            },
            {
                title: "Venom"
            }
        ]
    };
    var compiledHtml = _listTemplate(tasks);
    $("#js-panel-center").html(compiledHtml);
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
