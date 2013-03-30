

$(function () {
    if(!tgd.weakMax){
        tgd.weakMax = 4;
    }
    if(!tgd.strongMax){
        tgd.strongMax = 8;
    }
    if(!tgd.starveMax){
        tgd.starveMax = 5;
    }
    if(!tgd.bedtimeHour){
        tgd.bedtimeHour = 23;
    }
    if(!tgd.wakeupHour){
        tgd.wakeupHour = 8;
    }

    $("#weakMax").val(tgd.weakMax);
    $("#strongMax").val(tgd.strongMax);
    $("#starveMax").val(tgd.starveMax);
    $("#bedtimeHour").val(tgd.bedtimeHour);
    $("#wakeupHour").val(tgd.wakeupHour);
});


$(function() {
    $(".button").click(function() {
        // validate and process form here

        // need to do some error checking
        tgd.weakMax = $("input#weakMax").val();
        tgd.strongMax = $("input#strongMax").val();
        tgd.starveMax = $("input#starveMax").val();
        tgd.bedtimeHour = $("input#bedtimeHour").val();
        tgd.wakeupHour = $("input#wakeupHour").val();
    });
});