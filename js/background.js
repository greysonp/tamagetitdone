chrome.storage.local.get("tgdSeenIntro", function(data) {
    if (!data.tgdSeenIntro) {
        chrome.tabs.create({ "url": chrome.extension.getURL("intro.html") }, function() {
            chrome.storage.local.set({ "tgdSeenIntro": true });
        });
    }
})

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    // console.log("action: " + request.TGD.action);
    // GET PRODUCTIVITY LEVEL //
    if (request.TGD.action == "getProductivityLevel") {
        // console.log("getProductivityLevel");
        chrome.tabs.query({"active":true}, function(tab) {
            var domain = getRootDomain(tab[0].url);
            console.log(domain);
            chrome.storage.local.get("pages", function(data) {
                console.log(data);
                if (data.pages && data.pages.domains[domain]) {
                    var p = data.pages.domains[domain].p;

                    var categories = data.pages.domains[domain].categories;
                    var sum = 0;
                    for (var i = 0; i < categories.length; i++) {
                        sum += data.pages.categories[categories[i]].p;
                    }
                    if (categories.length > 0) {
                        var avgCat = sum / categories.length;
                        p = (p + avgCat) / 2;
                    }
                    sendResponse({ "p": p });
                } 
                else {
                    sendResponse({ "p": -1 });
                }
            });        
        });
        return true;
    }
    // SET PRODUCTIVITY LEVEL //
    else if (request.TGD.action == "setProductivityLevel") {
        // console.log("setProductivityLevel");
        chrome.tabs.query({"active":true}, function(tab) {
            var domain = getRootDomain(tab[0].url);

            // Find the matching data and update it.
            // We send a response, just so we know when the job is done
            chrome.storage.local.get("pages", function(data) {
                if (data.pages && data.pages.domains[domain]) {
                    data.pages.domains[domain].p = request.TGD.p;
                    chrome.storage.local.set(data, function() {
                        sendResponse({});
                    });
                }
                else {
                    sendResponse({});
                }
            });        
        });
        return true;
    }
    // GET SITE CATEGORIES //
    else if (request.TGD.action == "getCategories") {
        // console.log("getCategories");
        chrome.tabs.query({"active":true}, function(tab) {
            var domain = getRootDomain(tab[0].url);

            // Find the matching data and update it.
            // We send a response, just so we know when the job is done
            chrome.storage.local.get("pages", function(data) {
                if (data.pages && data.pages.domains[domain]) {
                    sendResponse({ "categories": data.pages.domains[domain].categories });
                } 
                else {
                    sendResponse({ "categories": [] });
                }
            });        
        });
        return true;
    }
});


function getRootDomain(domain) {
    if (domain.indexOf("http://") > -1) {
        domain = domain.substring(7);
    }
    else if (domain.indexOf("https://") > -1) {
        domain = domain.substring(8);
    }
    if (domain.indexOf("/") > -1) {
        domain = domain.substring(0, domain.indexOf("/"));
    }
    if (domain.indexOf("www.") > -1) {
        domain = domain.substring(4);
    }

    return domain;
}
