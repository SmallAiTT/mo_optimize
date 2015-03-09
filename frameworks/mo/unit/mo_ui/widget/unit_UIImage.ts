/**
 * Created by SmallAiTT on 2015/3/6.
 */
module unit_mo_ui{
    unit.curRegisterModule = "mo_ui";

    unit.registerTestBtn("UIImage", function(){
        res.load([unit_consts.icon_win, unit_consts.icon_lose], function(err, textureArr){
            var parent = unit.testContainer;
            var num = 400;

            var pWidth = parent.width, pHeight = parent.height;
            for(var i = 0; i < num; ++i){
                var rand1 = Math.random(), rand2 = Math.random();
                var texture = textureArr[i%2];
                var node:mo_ui.UIImage = new mo_ui.UIImage();
                node.x = rand1*pWidth;
                node.y = rand2*pHeight;
                node.width = texture.textureWidth;
                node.height = texture.textureHeight;
                node.loadTexture(texture);
                parent.addChild(node);
            }

        });
    });
}