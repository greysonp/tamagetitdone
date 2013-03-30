this.tgd = this.tgd || {};

(function()
{
    // Namespace var
    var anim = {};

    var spritesheet = new createjs.SpriteSheet({
        "animations": {
            "idle": {"frames": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
            "eat": {"frames": [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]},
            "run": {"frames": [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]},
            "all": {"frames": [1]}
        },
        "images": ["img/placeholder_anim.png"],
        "frames": [[2, 2, 124, 60, 0, -19, -52],
                   [130, 2, 124, 60, 0, -19, -52],
                   [258, 2, 124, 60, 0, -19, -52],
                   [386, 2, 124, 60, 0, -19, -52],
                   [514, 2, 124, 60, 0, -19, -52],
                   [642, 2, 124, 60, 0, -19, -52]]
    });

    var sprite = {};

    anim.init = function()
    {
        sprite = new createjs.BitmapAnimation(spritesheet);
        anim.idle();
        tgd.stage.addChild(sprite);
    }

    anim.idle = function()
    {
        sprite.gotoAndPlay("idle");
    }

    anim.run = function()
    {
        sprite.gotoAndPlay("run");
    }

    anim.eat = function()
    {
        sprite.gotoAndPlay("eat");
    }

    // Copy back
    this.tgd.anim = anim;
})();