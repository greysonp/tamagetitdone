console.log("top of action");
this.tgd = this.tgd || {};

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

    $(window).resize(function()
    {
        if (!active)
            $tgd.css('top', getTopOffset());
    });
}

action.idle = function(callback)
{
    anim.idle();
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

action.eat = function(minDist, callback, isWeak)
{
    // Return if eat is called before meal is finished
    if (active)
    {
        tgd.log("Already active. Exiting eat().")
        return;
    }

    // Grab the closest item and make it unclickable
    // if it's a link
    var item = getClosestItem(minDist);

    // If no item is close to the cursor, simply return
    if (item.get(0) == null)
    {
        tgd.log("No items close to cursor.");
        active = true;
        callback();
        active = false;
        return false;
    }

    // Set state
    active = true;

    // Play animation
    anim.run();

    // Grab the closest item and make it unclickable
    // if it's a link
    tgd.log(item.get(0).tagName);
    if (item.get(0).tagName == "A")
    {
        // Make link unclickable
        item.click(function(e) { e.preventDefault(); });
    }


    // Get position (just off to the left)
    var flipped = false;
    if (Math.random() <= 0.3) flipped = true; // 30% chance he'll flip

    var x = item.offset().left - $tgd.width();
    if (x < 0 || flipped)
    {
        x = item.offset().left + item.width();
        flipped = true;
    }
    var y = item.offset().top + item.height()/2 - $tgd.height()/2 - 30;

    // Animate it
    var eatTime = isWeak ? 2000 : 500;
    setCanvasPosition();
    $tgd.animate({
        left: x,
        top: y
    }, eatTime, "swing", function()
    {
        if (item.get(0).tagName == "A")
        {
            // Eat it
            anim.eat(flipped);
            nom(item, flipped, Math.max(200, (1000/item.text().length)), callback);
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

action.eatWeak = function(minDist, callback)
{
    action.eat(minDist, function()
    {
        $tgd.unbind();
        callback();
    }, true);

    $tgd.bind('mouseover', function()
    {
        console.log("Shoo!!");
        active = false;
        $tgd.stop();
        action.idle();
        $tgd.unbind();
    });
}

// NOM NOM NOM
function nom(target, flipped, timePerChomp, callback)
{
    var newText = target.text().substring(1);
    if (flipped)
    {
        newText = target.text().substring(0, target.text().length - 1);
        $tgd.css('left', target.offset().left + target.width());
    }
    target.text(newText);
    if (newText.length > 0)
    {
        setTimeout(function()
        {
            nom(target, flipped, callback);
        }, timePerChomp);
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

getTopOffset = function()
{
    return $("#bottom-marker").offset().top - $tgd.height();
}

action.eatLinkStrong = function()
{
    anim.run();
}

action.goToBed = function()
{
    active = true;
    // Add our cord
    $("body").append('<img src="http://www.greysonparrelli.com/tgd/cord.png" id="cord" style="position: absolute; top:-200px; left: 65px; z-index: 77777" />');

    // Animate our pet jumping up to grab the cord
    $("#tgd").animate( { top: 20 }, 750, "swing", function()
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
                    $("body").append('<h1 id="bed-header" style="position:fixed; top: 30px; left:140px; font-size:5em; color:white; font-family: sans-serif; opacity:0; z-index:2000">Go to bed.</h1>');

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
            $("#tgd").animate( { top: getTopOffset() }, 750);
        });
    });
    active = false;
}


function getClosestItem(minDist)
{
    var minIndex = 9999999;
    $("a, img, iframe, embed").each(function(i)
    {
        if ($(this).is(":visible"))
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
        }
    });

    return $("a, img, iframe, embed").eq(minIndex);
}
console.log("bottom of action");
