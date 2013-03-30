this.tgd = this.tgd || {};

(function ()
{
    var main = {};
    this.stage = {};
    var FPS = 30;
    this.useageTime = 0;

    //Action Variables
    this.activeRadius = 240; //radius around mouse that will trigger eat()

    //Timer Maximums
    this.weakMax = 4; //seconds until weak hunger
    this.strongMax = 8; //strong hunger
    this.starveMax = 5; //seconds until tamagotchi will start eating things beyond the activeRadius
    var timeSinceMeal = 0; //seconds since the tamagotchi last ate

    var hungerLevel = 0; //hunger level (0 = not hungry, 1 = weak, 2 = strong)

    //Clock Maximums (for sleeping)
    this.bedtimeHour = 23; //11PM
    this.wakeupHour = 8 //8AM
    var asleep = false;

    //Hungry Websites
    var sites = ["www.reddit.com", "www.youtube.com", "www.facebook.com", "www.twitter.com", "www.techcrunch.com", "www.stumbleupon.com",
        "www.commitsfromlastnight.com", "www.tumblr.com", "www.memebase.com", "www.pinterest.com", "localhost"];

    main.init = function ()
    {
        $("body").append('<canvas id="tgd" width="150" height="150" style="position: absolute; bottom: 0px; left: 0px; z-index: 55555"></canvas>');
        $("body").append('<div id="bottom-marker" style="position:fixed; bottom:0; background-color:blue"></div>');

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

        if (contains(sites, window.location.host))
             timer.init(timerCallback);
        else
            main.log("Domain is not unproductive: " + window.location.host);
    }

    function timerCallback()
    {
        timer.saveTime();
        this.useageTime = timer.getTime();
        localStorage.setItem("hungerLevel", hungerLevel); // store hunger level
        checkHunger();
        checkSleep();
    }

    function checkHunger()
    {
        if (this.useageTime < this.weakMax) //idle
        {
            main.log("Satisfied.");
            if (hungerLevel != 0)
            {
                //do idle animation
                action.idle();
                hungerLevel = 0;
            }
        }
        else if (this.useageTime >= this.weakMax && this.useageTime < this.strongMax)
        {
            hungerLevel = 1;
            main.log("Weak Hunger.");

            // do weak animation
            action.eatWeak(activeRadius, function()
            {
               action.idle();
            });


        }
        else if (this.useageTime >= this.strongMax)
        {
            hungerLevel = 2;
            main.log("Strong Hunger!");

            //do strong animation
            var hasEaten = action.eat(activeRadius, function ()
            {
                // Could send a callback to idle, but you don't have to
                action.idle();
            });

            //if tamagotchi is starving (hasn't eaten in a while), force it to eat something even if it is
            //outside the active radius of the cursor
            if (!hasEaten)
                timeSinceMeal += 1;
            if (timeSinceMeal > starveMax)
            {
                action.eat(9999999, function ()
                {
                    // Could send a callback to idle, but you don't have to
                    action.idle();
                });
                timeSinceMeal = 0;
            }
        }
    }

    function checkSleep()
    {
        var curTime = new Date();
        var curHour = curTime.getHours();

        //Between the hours of sleep and wake
        if ((curHour >= bedtimeHour && curHour <= 24) || (curHour >= 0 && curHour < wakeupHour))
        {
            if (!asleep)
            {
                action.goToBed();
                asleep = true;
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
        for (var i = 0; i < a.length; i++)
        {
            if (a[i] === obj)
            {
                return true;
            }
        }
        return false;
    }

    this.tgd = main;
})();

tgd.init();
