this.tgd = this.tgd || {};

(function ()
{
    var main = {};
    this.stage = {};
    var FPS = 30;

    //Timer Maximums
    this.weakMax = 300; //seconds until weak hunger
    this.strongMax = 600; //strong hunger
    var hungerLevel = 0; //hunger level (0 = not hungry, 1 = weak, 2 = strong)

    //Clock Maximums (for sleeping)
    this.bedtimeHour = 23; //11PM
    this.wakeupHour = 8; //8AM

    main.init = function ()
    {
        // Initialize createjs
        this.stage = new createjs.Stage("tgd");
        createjs.Ticker.addListener(main);
        createjs.Ticker.setFPS(FPS);
        createjs.Ticker.useRAF = true;

        // Initialize our modules
        main.anim.init();
        main.timer.init(timerCallback);

        // Initialize
    }

    function timerCallback()
    {
        main.log("Timer Callback Received.");
        main.timer.saveTime();
        var curTime = main.timer.getTime();
        localStorage.setItem("hungerLevel", hungerLevel); // store hunger level

        if (curTime < this.weakMax)
        {
            hungerLevel = 0;
            //do idle animation
        }
        else if (curTime >= this.weakMax && curTime < this.strongMax)
        {
            hungerLevel = 1;
            //do weak animation
        }
        else if (curTime >= this.strongMax)
        {
            hungerLevel = 2;
            //do strong animation
        }
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

    this.tgd = main;
})();