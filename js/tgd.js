this.tgd = this.tgd || {};

(function()
{
    var main = {};
    this.stage = {};
    var FPS = 30;

    main.init = function()
    {
        // Initialize createjs
        this.stage = new createjs.Stage("tgd");
        createjs.Ticker.addListener(main);
        createjs.Ticker.setFPS(FPS);
        createjs.Ticker.useRAF = true;

        // Initialize our modules
        main.anim.init();

//        this.timer.init();
    }

    main.tick = function()
    {
        this.stage.update();
    }

    main.log = function(msg, isError)
    {
        if(args.length == 1 || !isError)
            console.info(msg);
        else
            console.error(msg);
    }

    this.tgd = main;
})();