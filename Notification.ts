module TGD {
    export class Notification {
        private static TWEEN_TIME:number = 250;

        public static DURATION_SHORT:number = 1000;
        public static DURATION_LONG:number = 3000;

        public static INFO_BG_COLOR:string = "#b4bd95";
        public static INFO_TEXT_COLOR:string = "#000000";

        public static ALERT_BG_COLOR:string = "#982020";
        public static ALERT_TEXT_COLOR:string = "#ffffff";

        public static ERROR_BG_COLOR:string = "#000000";
        public static ERROR_TEXT_COLOR:string = "#ffffff";

        public static info(text:string, duration:number = 1000):void {
            Notification.showNotification(text, duration, {
                "background-color": Notification.INFO_BG_COLOR,
                "color": Notification.INFO_TEXT_COLOR
            });
        }

        public static alert(text:string, duration:number = 1000):void {
            Notification.showNotification(text, duration, {
                "background-color": Notification.ALERT_BG_COLOR,
                "color": Notification.ALERT_TEXT_COLOR
            });
        }

        public static error(text:string, duration:number = 1000):void {
            Notification.showNotification(text, duration, {
                "background-color": Notification.ERROR_BG_COLOR,
                "color": Notification.ERROR_TEXT_COLOR
            });
        }

        public static showNotification(text:string, duration:number = 1000, style:any = {}):void {
            $("body").prepend("<div class='tgd-popup'></div>");
            var $popup = $(".tgd-popup");
            $popup.text(text);
            $popup.css(style);
            $popup.css(top)

            var topOffset:number = -1 * $popup.height();
            $popup.css("top", topOffset + "px");
            $popup.animate({"top": 0}, Notification.TWEEN_TIME, function() {
                setTimeout(function() {
                    $popup.animate({"top": topOffset + "px"}, Notification.TWEEN_TIME, function() {
                        $popup.remove();
                    });
                }, duration);
            });
        }
    }
}