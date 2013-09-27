module TGD {
    export class EatAction extends Action {

        private mouseX:number;
        private mouseY:number;
        private minDist:number = 100;
        private $tgd;

        private animator:TGD.Animation;

        constructor(animator:TGD.Animation, properties?:Object) {
            super(animator, properties);
            this.animator = animator;
            this.mouseX = properties["mouseX"];
            this.mouseY = properties["mouseY"];
            this.$tgd = $('#tgd');
        }

        public run(callback:()=>void, properties?:Object) {
            this.mouseX = properties["mouseX"];
            this.mouseY = properties["mouseY"];

            // Grab the closest item and make it unclickable
            // if it's a link
            var item = TGD.Util.getClosestItem(this.mouseX, this.mouseY, this.minDist);

            // If no item is close to the cursor, simply return
            if (item.get(0) == null) {
                TGD.Util.log("No items close to cursor.");
                callback();
            }

            // Play animation
            this.animator.run();

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

            var x:number = item.offset().left - this.$tgd.width();
            if (x < 0 || flipped) {
                x = item.offset().left + item.width();
                flipped = true;
            }
            var y:number = item.offset().top + item.height()/2 - this.$tgd.height()/2 - 30;

            // Animate it
            var eatTime:number = 500;
            TGD.Tommy.setPosition();
            this.$tgd.animate({
                left: x,
                top: y
            }, eatTime, "swing", () => {
                if (item.get(0).tagName == "A") {
                    // Eat it
                    this.animator.eat(flipped);
                    this.nom(item, flipped, Math.max(200, (1000/item.text().length)), callback);
                }
                else {
                    item.css('display', 'none');
                    if (callback != null)
                        callback();
                }
            });
        }

        private nom(target, flipped:boolean, timePerChomp:number, callback:()=>void):void {
            var newText:string = target.text().substring(1);
            if (flipped) {
                newText = target.text().substring(0, target.text().length - 1);
                this.$tgd.css('left', target.offset().left + target.width());
            }
            target.text(newText);
            if (newText.length > 0) {
                setTimeout(() => {
                    this.nom(target, flipped, 100, callback);
                }, timePerChomp);
            }
            else {
                target.css('display', 'none');
                if (callback != null)
                    callback();
            }
        }
    }
}