///<reference path="../d/DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="../d/DefinitelyTyped/chrome/chrome.d.ts" />
///<reference path="../d/DefinitelyTyped/handlebars/handlebars.d.ts" />
$(document).ready(init);
$(window).resize(resize);

var _listTemplate;

function init() {
    initList();
    resize();
    updateList();
}

function resize() {
    var sum = 0;
    var marginLeft = 0;
    if ($("#js-panel-left").is(":visible")) {
        sum += $("#js-panel-left").width();
        marginLeft = $("#js-panel-left").width();
    }
    if ($("#js-panel-right").is(":visible")) {
        sum += $("#js-panel-right").width();
    }

    $("#js-panel-center").css("width", (window.innerWidth - sum) + "px");
    $("#js-panel-center").css("margin-left", marginLeft + "px");

}

function initList() {
    _listTemplate = Handlebars.compile($("#js-panel-center").html());
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
