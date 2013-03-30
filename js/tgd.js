this.tgd = this.tgd || {};

(function()
{
    var tgd = {};
    this.stage = {};
    var FPS = 30;


    tgd.init = function()
    {
        this.stage = new createjs.Stage("tgd");
        createjs.Ticker.addListener(this);
        createjs.Ticker.setFPS(FPS);
        createjs.Ticker.useRAF = true;
        tgd.anim.test();
//        this.timer.init();
    }

    tgd.tick = function()
    {
        this.stage.update();
    }

    this.tgd = tgd;
})();