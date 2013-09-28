module TGD {
    export class GoToBedAction extends Action {

        private animation:TGD.Animation;

        constructor(animation:TGD.Animation, properties?:Object) {
            super(animation, properties);
            this.animation = animation;
        }

        public run(callback:()=>void, properties?:Object) {
            // Add our cord
            $("body").append('<img src="' + chrome.extension.getURL("img/cord.png") + '" id="cord" style="position: absolute; top:-200px; left: 65px; z-index: 77777" />');

            // Cache our jQueries
            var $body = $('body');
            var $cord = $('#cord');
            var $tgd = $('#tgd');

            // Animate our pet jumping up to grab the cord
            $tgd.animate( { top: 20 }, 750, "swing", function() {
                // When that's done, pull the cord down and... (see below)
                $cord.animate({ top: -50 }, 750, "swing", function() {
                    // Wait a little bit so we can see a little bounce
                    setTimeout(function() {
                        // Add our big black cover, just enough so we can see something is underneath, but not enough that we can read it easily
                        $body.append('<div style="position:fixed; top:0px; left:0px; width:100%; height:100%; background-color:black; opacity:0.95; z-index:1000;"></div>');

                        // Wait a little bit for timing purposes
                        setTimeout(function() {
                            // Create our "Go to bed." header
                            $body.append('<h1 id="bed-header" style="position:fixed; top: 30px; left:140px; font-size:5em; color:white; font-family: sans-serif; opacity:0; z-index:2000">Go to bed.</h1>');

                            // Fade it in
                            $("#bed-header").animate({ opacity: 1}, 500);
                        }, 500);
                    }, 100);

                    $cord.effect("bounce", "slow");
                });

                // ...have the pet animate to where the cord snags
                $tgd.animate( { top: 200 }, 750, "swing", function() {
                    // After he loses the cord, he falls to the floor
                    $tgd.animate( { top: Tommy.getTopOffset() }, 750, "swing", function() {
                        callback();
                    });
                });
            });
        }

        public stop() {
            $('#tgd').stop();
        }
    }
}