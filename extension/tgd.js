this.tgd = this.tgd || {};

(function ()
{
    var main = {};
    this.stage = {};
    var FPS = 30;
    this.useageTime = 0;

    //Timer Maximums
    this.weakMax = 300; //seconds until weak hunger
    this.strongMax = 600; //strong hunger
    this.eatInterval = 10; //interval between munchies

    var hungerLevel = 0; //hunger level (0 = not hungry, 1 = weak, 2 = strong)

    //Clock Maximums (for sleeping)
    this.bedtimeHour = 23; //11PM
    this.wakeupHour = 8; //8AM
    var asleep = false;

    //Hungry Websites
    var sites = ["reddit.com", "youtube.com", "facebook.com", "twitter.com", "techcrunch.com", "stumbleupon.com",
        "commitsfromlastnight.com", "tumblr.com", "memebase.com", "pinterest.com"];

    main.init = function ()
    {
        $("body").append('<canvas id="tgd" width="150" height="150" style="position: absolute; bottom: 0px; left: 0px;"></canvas>');
        $("body").append('<div id="bottom-marker" style="position:fixed; bottom:0; background-color:blue"></div>');
        console.log("Werd?");
        // Initialize createjs
        this.stage = new createjs.Stage("tgd");
        createjs.Ticker.addListener(main);
        createjs.Ticker.setFPS(FPS);
        createjs.Ticker.useRAF = true;

        // Initialize our modules
        anim.init(finishInit);
    }

    function finishInit()
    {
        action.init();

        if (checkBedtime())
            return;

        // Sample use of eat and idle
        action.eat(function()
        {
            // Could send a callback to idle, but you don't have to
            action.idle(function()
            {
                action.eat(function()
                {
                    action.idle();
                });
            });
        });

        if (contains(sites, window.location.host))
            timer.init(timerCallback);
        else
            main.log("Domain is not unproductive: " + window.location.host);
    }

    function checkBedtime()
    {
        if (true)
        {
            action.goToBed();
            return true;
        }
    }

    function timerCallback()
    {
        main.log("Timer Callback Received.");
        timer.saveTime();
        this.useageTime = timer.getTime();
        localStorage.setItem("hungerLevel", hungerLevel); // store hunger level
        checkHunger();
        checkSleep();
    }

    function checkHunger()
    {
        if (this.useageTime < this.weakMax)
        {
            hungerLevel = 0;
            main.log("Idle");
            //do idle animation
        }
        else if (this.useageTime >= this.weakMax && this.useageTime < this.strongMax)
        {
            hungerLevel = 1;
            main.log("Weak");
            //do weak animation
        }
        else if (this.useageTime >= this.strongMax)
        {
            hungerLevel = 2;
            main.log("Strong");
            //do strong animation
        }
    }

    function checkSleep()
    {
        var curTime = new Date();
        var curHour = curTime.getHours();

        //Between the hours of sleep and wake
        if ((curHour >= bedtimeHour && curHour <= 24) || (curHour >= 0 && curHour < wakeupHour))
        {
            if (!asleep){
                //do sleep
                this.asleep = true;
            }
        }
        else
        {
            if (asleep)
            {
                //do wakeUp
                asleep = false;
            }
        }
    }

    main.isAsleep = function ()
    {
        return asleep;
    }

    main.tick = function ()
    {
        this.stage.update();
    }

    main.log = function (msg, isError)
    {
        if (arguments.length == 1 || !isError)
            console.info(msg);
        else
            console.error(msg);
    }

    function contains(a, obj)
    {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    this.tgd = main;
})();

tgd.init();