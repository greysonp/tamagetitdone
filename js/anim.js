this.tgd = this.tgd || {};

(function()
{
    // Namespace var
    var anim = {};

    var spritesheet = {};

    var sprite = {};

    anim.init = function(callback)
    {
        spritesheet = new createjs.SpriteSheet({
            "animations": {
                "idle": {"frames": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
                "eat": {"frames": [2, 2, 5, 5, 6, 6]},
                "run": {"frames": [2, 2, 2, 3, 3, 3, 4, 4, 4]},
                "eat_h": {"frames": [7, 7, 8, 8, 9, 9, 9]},
                "all": {"frames": [0]}},
            "images": ["img/placeholder_anim.png"],
            "frames": [[0, 0, 256, 256, 0, -3, -19],
                [256, 0, 256, 256, 0, -3, -19],
                [512, 0, 256, 256, 0, -3, -19],
                [768, 0, 256, 256, 0, -3, -19],
                [1024, 0, 256, 256, 0, -3, -19],
                [1280, 0, 256, 256, 0, -3, -19],
                [1536, 0, 256, 256, 0, -3, -19],
                [1792, 0, 256, 256, 0, -3, -19],
                [0, 256, 256, 256, 0, -3, -19],
                [256, 256, 256, 256, 0, -3, -19]]
        });
        if (!spritesheet.complete)
        {
            spritesheet.addEventListener("complete", function()
            {
                finishInit(callback);
            });
        }
        else
        {
            finishInit(callback);
        }
    }

    function finishInit(callback)
    {
        sprite = new createjs.BitmapAnimation(spritesheet);
        anim.idle();
        tgd.stage.addChild(sprite);
        if (callback != null)
            callback();
    }

    anim.idle = function(flipped)
    {
        sprite.gotoAndPlay("idle");
    }

    anim.run = function(flipped)
    {
        sprite.gotoAndPlay("run");
    }

    anim.eat = function(flipped)
    {
        if (flipped)
            sprite.gotoAndPlay("eat_h");
        else
            sprite.gotoAndPlay("eat");
    }

    // Copy back
    this.tgd.anim = anim;
})();