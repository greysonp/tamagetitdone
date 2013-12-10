var isProductive = false;
$(document).ready(init);

function init() {
    chrome.runtime.sendMessage({
        "TGD": {
            "action": "getProductivityLevel"
        }
    }, function(response) {
        console.log(response);
        // a -1 indicates we don't have a record for this domain
        if (response.p != -1) {
            // If it's a productive site, let people mark it as unproductive
            if (response.p > 0.5) {
                $("#js-productive-btn").html("<i class='icon-bullhorn'></i> Mark Site as Unproductive</span>");
                isProductive = true;
            }
            else {
                $("#js-productive-btn").html("<i class='icon-shield'></i> Mark Site as Productive</span>");
                isProductive = false;
            }
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
}