this.tgd = this.tgd || {};

(function()
{
    // Namespace var
    var action = {};
    var $tgd = {};
    var active = false;

    var mouseX = 0;
    var mouseY = 0;

    action.init = function()
    {
        $tgd = $("#tgd");
        // Track mouse position
        $(document).mousemove(function(e)
        {
            mouseX = e.pageX;
            mouseY = e.pageY;
        });

        // Reposition on scroll if not moving
        $(document).scroll(function()
        {
            if (!active)
                $tgd.css('top', getTopOffset());
        });
    }

    action.idle = function(callback)
    {
        tgd.anim.idle();
        active = true;
        setCanvasPosition();
        $tgd.stop().animate({
            top: getTopOffset(),
            left: 0
        }, 500, "swing", function()
        {
            active = false;
            if (callback != null)
                callback();
        });
    }

    action.eat = function(callback)
    {
        // Set state
        active = true;

        // Play animation
        tgd.anim.run();

        var item = getClosestItem();
        var x = item.offset().left - $tgd.width();
        var y = item.offset().top + item.height()/2 - $tgd.height()/2;

        setCanvasPosition();

        $tgd.animate({
            left: x,
            top: y
        }, 500, "swing", function()
        {
            // Eat it
            nom(item, callback);

        });

    }

    function nom(target, callback)
    {
        var newText = target.text().substring(1);
        target.text(newText);
        if (newText.length > 0)
        {
            setTimeout(function()
            {
                nom(target, callback);
            }, 300);
        }
        else
        {
            target.css('display', 'none');
            active = false;
            if (callback != null)
                callback();
        }
    }

    function setCanvasPosition()
    {
        var x = $tgd.offset().left;
        var y = $tgd.offset().top;

        $tgd.css("left", x).css("top", y);
    }

    function getTopOffset()
    {
        return $("#bottom-marker").offset().top - $tgd.height();
    }

    action.eatLinkStrong = function()
    {
        tgd.anim.run();
    }

    function getClosestItem()
    {
        var minDist = 9999999;
        var minIndex = 9999999;
        $("a, img, iframe, embed").each(function(i)
        {

            var x = $(this).offset().left + $(this).width()/2;
            var y = $(this).offset().top + $(this).height()/2;

            var dx = x - mouseX;
            var dy = y - mouseY;
            var dist = Math.sqrt((dx * dx) + (dy * dy));

            if (dist < minDist)
            {
                minDist = dist;
                minIndex = i;
            }
        });

        return $("a, img, iframe, embed").eq(minIndex);
    }

    // Copy back
    this.tgd.action = action;
})();