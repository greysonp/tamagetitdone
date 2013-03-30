this.tgd = this.tgd || {};

timer = {};
var tid = {};
var t = 0;
var domain = "";
var started = false;
var isActive = true;
var timer = {};
var cb = {};

timer.init = function (callback)
{
    cb = callback;
    domain = window.location.host;

    //Check if timer already exists
    var prevTime = parseInt(timer.getTime());
    if (prevTime != null)
        t = prevTime;
    else
        t = 0;

    //Start timer
    tid = setInterval(function ()
    {
        myTimer();
        if (isActive)
            cb();
    }, 1000); //initialize timer
    started = 1; //timer flag
}

function myTimer()
{
    if (isActive)
        t = t + 1;
}

timer.resetTimer = function (callback)
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
    //tgd.log("SAVED: " + domain + " : " + t); //dev
}

timer.getTime = function ()
{
    var curTime = parseInt(localStorage.getItem(domain));
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


