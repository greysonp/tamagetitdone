$(function() {
    $(".button").click(function() {
        // validate and process form here

        // process weakMax: need to do some error checking
        tgd.weakMax = $("input#weakMax").val();
        alert(tgd.weakMax);

        var strongMax = $("input#strongMax").val();
        alert(strongMax);

        var eatInterval = $("input#eatInterval").val();
        alert(eatInterval);

        var bedtimeHour = $("input#bedtimeHour").val();
        alert(bedtimeHour);

        var wakeupHour = $("input#wakeupHour").val();
        alert(wakeupHour);

    });
});