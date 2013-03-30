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

        // Grab the closest item and make it unclickable
        // if it's a link
        var item = getClosestItem();
        tgd.log(item.get(0).tagName);
        if (item.get(0).tagName == "A")
        {
            // Make link unclickable
            item.click(function(e) { e.preventDefault(); });
        }

        // Get position (just off to the left)
        var flipped = false;
        var x = item.offset().left - $tgd.width();
        if (x < 0)
        {
            x = item.offset().left + item.width();
            flipped = true;
        }
        var y = item.offset().top + item.height()/2 - $tgd.height()/2 - 30;

        // Animate it
        setCanvasPosition();
        $tgd.animate({
            left: x,
            top: y
        }, 500, "swing", function()
        {
            if (item.get(0).tagName == "A")
            {
                // Eat it
                tgd.anim.eat(flipped);
                nom(item, callback);
            }
            else
            {
                item.css('display', 'none');
                active = false;
                if (callback != null)
                    callback();
            }
        });

    }

    // NOM NOM NOM
    function nom(target, callback)
    {
        var newText = target.text().substring(1);
        target.text(newText);
        $tgd.css('left', target.offset().left + target.width());
        if (newText.length > 0)
        {
            setTimeout(function()
            {
                nom(target, callback);
            }, 200);
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