///<reference path="d/DefinitelyTyped/jquery/jquery.d.ts" />
///<reference path="d/DefinitelyTyped/jqueryui/jqueryui.d.ts" />

module TGD {
    export class Action {
        // Whether or not an action is currently being performed
        private _active:boolean;

        // Mouse x and y position
        private mouseX:number;
        private mouseY:number;
        
        // A reference to our animator
        private animation:TGD.Animation;

        /**
         * Creates a new Action manager.
         * @param   {Function}  A callback that will be executed when initialization
         *                        is done.
         */
        constructor(callback:()=>void) {
            this.animation = new TGD.Animation(() => {
                this.init(callback);
            });
        }

        public init(callback:()=>void):void {
            // Track mouse position
            $(document).mousemove(function(e) {
                this.mouseX = e.pageX;
                this.mouseY = e.pageY;
            });

            // Reposition on scroll if not moving
            $(document).scroll(() => {
                if (!this._active)
                    $('#tgd').css('top', this.getTopOffset());
            });

            // Reposition on browser resize if not moving
            $(window).resize(() => {
                if (!this._active) 
                    $('#tgd').css('top', this.getTopOffset());
            });

            callback();
        }

        public idle(callback:()=>void = null):void {
            this.animation.idle();
            this._active = true;
            this.setCanvasPosition();

            $('#tgd').stop().animate({
                top: this.getTopOffset(),
                left: 0
            }, 500, "swing", function() {
                this._active = false;
                if (callback != null)
                    callback();
            });
        }

        public eat(minDist:number, callback:()=>void, isWeak:boolean):boolean {
            // Return if eat is called before meal is finished
            if (this._active) {
                TGD.Util.log("Already active. Exiting eat().")
                return;
            }

            // Grab the closest item and make it unclickable
            // if it's a link
            var item = this.getClosestItem(minDist);

            // If no item is close to the cursor, simply return
            if (item.get(0) == null)
            {
                TGD.Util.log("No items close to cursor.");
                this._active = true;
                callback();
                this._active = false;
                return false;
            }

            // Set state
            this._active = true;

            // Play animation
            this.animation.run();

            // Grab the closest item and make it unclickable
            // if it's a link
            TGD.Util.log(item.get(0).tagName);
            if (item.get(0).tagName == "A") {
                // Make link unclickable
                item.click(function(e) { e.preventDefault(); });
            }

            // Get position (just off to the left)
            var flipped:boolean = false;
            if (Math.random() <= 0.3) flipped = true; // 30% chance he'll flip

            var x:number = item.offset().left - $('#tgd').width();
            if (x < 0 || flipped) {
                x = item.offset().left + item.width();
                flipped = true;
            }
            var y:number = item.offset().top + item.height()/2 - $('#tgd').height()/2 - 30;

            // Animate it
            var eatTime:number = isWeak ? 2000 : 500;
            this.setCanvasPosition();
            $('#tgd').animate({
                left: x,
                top: y
            }, eatTime, "swing", function() {
                if (item.get(0).tagName == "A") {
                    // Eat it
                    this.animation.eat(flipped);
                    this.nom(item, flipped, Math.max(200, (1000/item.text().length)), callback);
                }
                else {
                    item.css('display', 'none');
                    this._active = false;
                    if (callback != null)
                        callback();
                }
            });
        }

        public eatWeak(minDist:number, callback:()=>void = null):void {
            this.eat(minDist, function() {
                $('#tgd').unbind();
                if (callback !== null)
                    callback();
            }, true);

            $('#tgd').bind('mouseover', () => {
                TGD.Util.log("Shoo!!");
                this._active = false;
                $('#tgd').stop();
                this.animation.idle();
                $('#tgd').unbind();
            });
        }

        public goToBed() {
            this._active = true;
            // Add our cord
            $("body").append('<img src="' + chrome.extension.getURL("img/cord.png") + '" id="cord" style="position: absolute; top:-200px; left: 65px; z-index: 77777" />');

            // Animate our pet jumping up to grab the cord
            $("#tgd").animate( { top: 20 }, 750, "swing", function() {
                // When that's done, pull the cord down and... (see below)
                $("#cord").animate({ top: -50 }, 750, "swing", function() {
                    // Wait a little bit so we can see a little bounce
                    setTimeout(function() {
                        // Add our big black cover, just enough so we can see something is underneath, but not enough that we can read it easily
                        $("body").append('<div style="position:fixed; top:0px; left:0px; width:100%; height:100%; background-color:black; opacity:0.95; z-index:1000;"></div>');

                        // Wait a little bit for timing purposes
                        setTimeout(function() {
                            // Create our "Go to bed." header
                            $("body").append('<h1 id="bed-header" style="position:fixed; top: 30px; left:140px; font-size:5em; color:white; font-family: sans-serif; opacity:0; z-index:2000">Go to bed.</h1>');

                            // Fade it in
                            $("#bed-header").animate({ opacity: 1}, 500);
                        }, 500);
                    }, 100);

                    $("#cord").effect("bounce", "slow");
                });

                // ...have the pet animate to where the cord snags
                $("#tgd").animate( { top: 200 }, 750, "swing", function() {
                    // After he loses the cord, he falls to the floor
                    $("#tgd").animate( { top: this.getTopOffset() }, 750);
                });
            });
            this._active = false;
        }

        private nom(target, flipped:boolean, timePerChomp:number, callback:()=>void):void {
            var newText:string = target.text().substring(1);
            if (flipped) {
                newText = target.text().substring(0, target.text().length - 1);
                $('#tgd').css('left', target.offset().left + target.width());
            }
            target.text(newText);
            if (newText.length > 0) {
                setTimeout(() => {
                    this.nom(target, flipped, 100, callback);
                }, timePerChomp);
            }
            else {
                target.css('display', 'none');
                this._active = false;
                if (callback != null)
                    callback();
            }
        }

        private setCanvasPosition():void {
            var x:number = $('#tgd').offset().left;
            var y:number = $('#tgd').offset().top;

            $('#tgd').css("left", x).css("top", y);
        }

        private getTopOffset():number {
            return $("#bottom-marker").offset().top - $('#tgd').height();
        }

        private eatLinkStrong():void {
            this.animation.run();
        }

        private getClosestItem(minDist) {
            var minIndex:number = 9999999;
            var _this:Action = this;
            $('a, img, iframe, embed').each(function(i) {
                if ($(this).is(":visible")) {
                    var x:number = $(this).offset().left + $(this).width()/2;
                    var y:number = $(this).offset().top + $(this).height()/2;

                    var dx:number = x - _this.mouseX;
                    var dy:number = y - _this.mouseY;
                    var dist:number = Math.sqrt((dx * dx) + (dy * dy));

                    if (dist < minDist) {
                        minDist = dist;
                        minIndex = i;
                    }
                }
            });

            return $('a, img, iframe, embed').eq(minIndex);
        }
    }
}
