this.tgd = this.tgd || {};

(function ()
{
    var tid = {};
    var started = false;
    var t = {};
    var domain = "";

    var timer = {};

    timer.init = function()
    {
        tid = setInterval(function(){myTimer()},1000); //initialize timer
        started = 1; //timer flag
        t = 0; //set start time
        domain = window.location.host;
    }

    function myTimer()
    {
        t = t + 1;
    }

    timer.restartTimer = function()
    {
        if (!started)
        {
            tid = setInterval(function(){myTimer()},1000);
            started = 1;
        }
    }

    timer.pauseTimer = function()
    {
        clearInterval(tid);
        started = 0;
    }

    timer.saveTime = function()
    {
        localStorage.setItem(domain, t); //saves to the database, key/value
        tgd.log(domain + " : " + t); //dev
    }

    timer.getTime = function()
    {
        tgd.log(domain + " : " + localStorage.getItem(domain)); //dev
    }

    this.tgd.timer = timer;
    var tid = {};
    var t = {};
    var domain = "";
    var started = false;
    var isActive = true;
    var timer = {};
    var cb = {};

    timer.init = function (callback)
    {
        cb = callback;
        tid = setInterval(function ()
        {
            myTimer();
            if (isActive)
                cb();
        }, 1000); //initialize timer
        started = 1; //timer flag
        t = 0; //set start time
        domain = window.location.host;
    }

    function myTimer()
    {
        if (isActive)
            t = t + 1;
    }

    timer.restartTimer = function (callback)
    {
        if (!started)
        {
            cb = callback;
            tid = setInterval(function ()
            {
                myTimer();
                cb();
            }, 1000);
            started = 1;
        }
    }

    timer.pauseTimer = function ()
    {
        clearInterval(tid);
        started = 0;
    }

    timer.saveTime = function ()
    {
        localStorage.setItem(domain, t); //saves to the database, key/value
        tgd.log("SAVED: " + domain + " : " + t); //dev
    }

    timer.getTime = function ()
    {
        var curTime = localStorage.getItem(domain);
        tgd.log("RETRIEVED: " + domain + " : " + curTime); //dev
        return curTime;
    }

    window.onfocus = function ()
    {
        isActive = true;
    };

    window.onblur = function ()
    {
        isActive = false;
    };

    this.tgd.timer = timer;
})();