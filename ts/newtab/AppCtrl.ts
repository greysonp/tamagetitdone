///<reference path="../d/DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="../d/DefinitelyTyped/chrome/chrome.d.ts" />

var app = angular.module( 'myApp', [] )
// Controller
function AppCtrl($scope) {
    // =================================================
    // INITIALIZATION
    // =================================================
    $scope.apps = [];
    chrome.management.getAll(function(apps:chrome.management.ExtensionInfo[]) {
        var filteredApps:chrome.management.ExtensionInfo[] = [];
        for (var i = 0; i < apps.length; i++) {
            var app:chrome.management.ExtensionInfo = apps[i];
            if (app.enabled && (app.type === "hosted_app" || app.type === "packaged_app")) {
                app["imgUrl"] = getIconUrl(app);
                filteredApps.push(app);
            }
        }
        filteredApps.sort(function(a, b):number {
            if (a.name > b.name)
                return 1;
            else
                return -1;
        });
        $scope.apps = filteredApps;
        $scope.$apply();
    });

    function getIconUrl(app:chrome.management.ExtensionInfo):string {
        if (!app.icons || app.icons.length === 0) {
            return chrome.extension.getURL("img/newtab/default_icon.png");
        }
        var largest:any = {size:0};
        for (var i = 0; i < app.icons.length; i++) {
            var icon:chrome.management.IconInfo = app.icons[i];
            if (icon.size > largest.size) {
                largest = icon;
            }
        }
        return largest.url;
    }

    // =================================================
    // APP CONTROL
    // =================================================
    
    $scope.launchApp = function(app:chrome.management.ExtensionInfo) {
        chrome.management.launchApp(app.id);
    }
}