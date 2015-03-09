/**
 * Created by SmallAiTT on 2015/3/6.
 */
module unit_egret{
    unit.curRegisterModule = "egret";

    unit.registerTestBtn("Bitmap", function(){
        res.load([unit_consts.icon_win, unit_consts.icon_lose], function(err, textureArr){
            var parent = unit.testContainer;
            var num = 400;

            var pWidth = parent.width, pHeight = parent.height;
            for(var i = 0; i < num; ++i){
                var rand1 = Math.random(), rand2 = Math.random();
                var texture = textureArr[i%2];
                var node = new egret.Bitmap();
                node.x = rand1*pWidth;
                node.y = rand2*pHeight;
                node.width = texture.textureWidth;
                node.height = texture.textureHeight;
                node.texture = texture;
                parent.addChild(node);
            }

        });
    });
}