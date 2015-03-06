module mo {
    export class BlurMaskLayer extends Layer {
        static __className:string = "BlurMaskLayer";

        _finallyTexture:egret.RenderTexture;

        //@override
        _initProp(){
            super._initProp();
            var self = this;
            self._setPenetrable(true);//托盘设置为可穿透
        }
        init(tray, ...args){
            super.init();
            var self = this;

            // 1.截取整个场景
            // 缩小4倍
            var scale = 0.25;
            var scene = runningScene;
            var bounds = new egret.Rectangle();
            var p:Point = scene.globalToLocal(0, 0);
            var stage = getStage();
            bounds.x = p.x;
            bounds.y = p.y;
            bounds.width = stage.stageWidth * scale;
            bounds.height = stage.stageHeight * scale;
            var renderTexture:egret.RenderTexture = new egret.RenderTexture();
            renderTexture.drawToTexture(scene, bounds, scale);

            // 2.水平像素模糊
            var filter = new egret.BlurFilter(1, 0);
            var bitmap = new egret.Bitmap();
            bitmap.texture = renderTexture;
            bitmap.filter = filter;

            var renderTexture1:egret.RenderTexture = new egret.RenderTexture();
            renderTexture1.drawToTexture(bitmap);

            // 3.垂直像素模糊
            filter.blurX = 0;
            filter.blurY = 1;
            bitmap.texture = renderTexture1;

            var finallyTexture:egret.RenderTexture = self._finallyTexture = new egret.RenderTexture();
            finallyTexture.drawToTexture(bitmap);

            // 4.加到场景里
            bitmap.texture = finallyTexture;
            bitmap.anchorX = 0.5;
            bitmap.anchorY = 0.5;
            bitmap.x = stage.stageWidth/2;
            bitmap.y = stage.stageHeight/2;
            self.addChild(bitmap);
            bitmap.filter = null;

            // 5.缩放到正常大小
            bitmap.scaleX *= self.width/bitmap.width;
            bitmap.scaleY *= self.height/bitmap.height;

            // 6.释放临时rendertexture
            renderTexture.dispose();
            renderTexture1.dispose();
        }

        //@override
        dtor(){
            super.dtor();
            this._finallyTexture.dispose();
        }
    }
}