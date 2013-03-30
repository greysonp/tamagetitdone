this.tgd = this.tgd || {};

(function()
{
    var main = {};
    this.stage = {};
    var FPS = 30;


    main.init = function()
    {
        this.stage = new createjs.Stage("tgd");
        createjs.Ticker.addListener(main);
        createjs.Ticker.setFPS(FPS);
        createjs.Ticker.useRAF = true;
        main.anim.init();
//        this.timer.init();
    }

    main.tick = function()
    {
        this.stage.update();
    }

    this.tgd = main;
})();