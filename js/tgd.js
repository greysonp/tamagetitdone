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
        // Initialize createjs
        this.stage = new createjs.Stage("tgd");
        createjs.Ticker.addListener(main);
        createjs.Ticker.setFPS(FPS);
        createjs.Ticker.useRAF = true;

        // Initialize our modules
        main.anim.init(finishInit);
    }

    function finishInit()
    {
        main.action.init();

        if (checkBedtime())
            return;

        // Sample use of eat and idle
        main.action.eat(function()
        {
            // Could send a callback to idle, but you don't have to
            main.action.idle(function()
            {
                main.action.eat(function()
                {
                    main.action.idle();
                });
            });
        });

        if (contains(sites, window.location.host))
            main.timer.init(timerCallback);
        else
            main.log("Domain is not unproductive: " + window.location.host);
    }

    function checkBedtime()
    {
        if (true)
        {
            // Add our cord
            $("body").append('<img src="img/cord.png" id="cord" style="position: absolute; top:-200px; left: 65px;" />');

            // Animate our pet jumping up to grab the cord
            $("#tgd").animate( { bottom: main.action.getTopOffset() - 20 }, 750, "swing", function()
            {
                // When that's done, pull the cord down and... (see below)
                $("#cord").animate({ top: -50 }, 750, "swing", function()
                {
                    // Wait a little bit so we can see a little bounce
                    setTimeout(function()
                    {
                        // Add our big black cover, just enough so we can see something is underneath, but not enough that we can read it easily
                        $("body").append('<div style="position:fixed; top:0px; left:0px; width:100%; height:100%; background-color:black; opacity:0.95; z-index:1000;"></div>');

                        // Wait a little bit for timing purposes
                        setTimeout(function()
                        {
                            // Create our "Go to bed." header
                            $("body").append('<h1 id="bed-header" style="position:fixed; top: 30px; margin:auto; font-size:5em; color:white; font-family: sans-serif; opacity:0; z-index:2000">Go to bed.</h1>');

                            // Fade it in
                            $("#bed-header").animate({ opacity: 1}, 500);
                        }, 500);
                    }, 100);

                    $("#cord").effect("bounce", "slow");
                });

                // ...have the pet animate to where the cord snags
                $("#tgd").animate( { top: 200 }, 750, "swing", function()
                {
                    // After he loses the cord, he falls to the floor
                    $("#tgd").animate( { top: main.action.getTopOffset() }, 750);
                });
            });

            return true;
        }
    }

    function timerCallback()
    {
        main.log("Timer Callback Received.");
        main.timer.saveTime();
        this.useageTime = main.timer.getTime();
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