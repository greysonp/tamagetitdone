module TGD {
    export class Util {
        public static log(text:any):void {
            console.info(text);
        }

        public static getClosestItem(mouseX:number, mouseY:number, minDist:number = 250) {
            var minIndex:number = -1;
            $('a, img, iframe, embed').each(function(i) {
                if ($(this).is(":visible")) {
                    var x:number = $(this).offset().left + $(this).width()/2;
                    var y:number = $(this).offset().top + $(this).height()/2;

                    var dx:number = x - mouseX;
                    var dy:number = y - mouseY;
                    var dist:number = Math.sqrt((dx * dx) + (dy * dy));

                    if (dist < minDist) {
                        minDist = dist;
                        minIndex = i;
                    }
                }
            });
            if (minIndex >= 0)
                return $('a, img, iframe, embed').eq(minIndex);
            else
                return null;
        }

        public static getDistanceFromRest() {
            var $tgd = $("#tgd");

            var x1 = $tgd.offset().left;
            var y1 = $tgd.offset().top;

            var x2 = TGD.Main.restingX;
            var y2 = TGD.Tommy.getTopOffset();

            var xDiff = x2 - x1;
            var yDiff = y2 - y1;

            return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        }
    }
}