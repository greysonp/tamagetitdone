this.tgd = this.tgd || {};

(function()
{
    // Namespace var
    var action = {};

    action.init = function()
    {

    }

    action.idle = funtion()
    {
        tgd.anim.idle();
    }

    action.eat = function()
    {
        tgd.anim.eat();
    }

    action.run = function()
    {
        tgd.anim.run();
    }

    // Copy back
    this.tgd.action = action;
})();