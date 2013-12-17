var isProductive = true;
$(document).ready(init);

function init() {
    setScrollViewHeight();

    chrome.runtime.sendMessage({
        "TGD": {
            "action": "getProductivityLevel"
        }
    }, function(response) {
        // a -1 indicates we don't have a record for this domain
        if (response.p != -1) {
            // If it's a productive site, let people mark it as unproductive
            if (response.p >= 0.5) {
                setSiteAsProductive();
            }
            else {
                setSiteAsUnproductive();
            }
        }
        else {
            setSiteAsProductive();
        }
        $("#js-productive-btn").click(function() {
            chrome.runtime.sendMessage({
                "TGD": {
                    "action": "setProductivityLevel",
                    "p": isProductive ? 0 : 1
                }
            }, function(response) {
                init();
            });
        })
    });

    chrome.runtime.sendMessage({
        "TGD": {
            "action": "getCategories"
        }
    }, function(response) {
        var outString = "";
        if (response.categories.length > 0) {
            for (var i = 0; i < response.categories.length; i++) {
                outString += response.categories[i];
                if (i < response.categories.length - 1) 
                    outString += ", ";
            }
        }
        else {
            outString = "None";
        }
        $("#js-categories").text(outString);
    });
}

function setSiteAsProductive() {
    isProductive = true;
    $("#js-productive-btn").html("<i class='icon-bullhorn'></i> Mark Site as Unproductive</span>");
}

function setSiteAsUnproductive() {
    isProductive = false;
    $("#js-productive-btn").html("<i class='icon-shield'></i> Mark Site as Productive</span>");
}

function setScrollViewHeight() {
    var top = $("#js-top-panel").height() + parseInt($("#js-top-panel").css("padding"));
    var bottom = $("#js-bottom-panel").height() + parseInt($("#js-bottom-panel").css("padding"));
    var remaining = $(window).height() - top - bottom;
    $("#js-scrollview").css("height", remaining);
}