this.tgd = this.tgd || {};

(function()
{
    // Namespace var
    var action = {};

    action.idle()
    {
        tgd.anim.idle();
    }

    action.eat()
    {
        tgd.anim.eat();
    }

    action.run()
    {
        tgd.anim.run();
    }

    // Copy back
    this.tgd.action = action;
})();