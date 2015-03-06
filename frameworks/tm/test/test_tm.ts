module tm_test{
    export function test_tm(){//TODO 先大概写着，以后要改
        tm.setTimeout(function(){console.log(arguments)}, 4000, "S");
        tm.setTimeout(function(){console.log(arguments)}, null, 5000, "SS");
        var inId1 = tm.setInterval(function(){console.log(arguments)}, 1000, "SSS");
        var inId2 = tm.setInterval(function(){console.log(arguments)}, null, 2000, "SSSS");
        tm.setTimeout(function(){
            tm.clearInterval(inId1);
            tm.clearInterval(inId2);
        }, 30000);
    }
}