module TGD {
    export class Util {
        public static log(text:string, isError:boolean = false):void {
            if (!isError)
                console.info(text);
        }

        public static getClosestItem(mouseX:number, mouseY:number, minDist:number) {
            var minIndex:number = 9999999;
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

            return $('a, img, iframe, embed').eq(minIndex);
        }
    }
}