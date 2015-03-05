module mo_ui{
    export class UIImage extends UIWidget{
        static __className:string = "UIImage";

        static NODE_OPTION_CLASS = mo_opt._UIImageOption;

        _nodeOption:mo_opt._UIImageOption;//子类重新声明下类型而已

        /**
         * fillMode
         */
        _setFillMode(fillMode:string){
            this._nodeOption.fillMode = fillMode;
        }
        public set fillMode(fillMode:string){
            this._setFillMode(fillMode);
        }
        public get fillMode():string{
            return this._nodeOption.fillMode;
        }

        /**
         * 是否开启蒙版
         */
        _setMaskEnabled(maskEnabled:boolean){
            this._nodeOption.maskEnabled = maskEnabled;
        }
        public set maskEnabled(maskEnabled:boolean){
            this._setMaskEnabled(maskEnabled);
        }
        public get maskEnabled():boolean{
            return this._nodeOption.maskEnabled;
        }
        /**
         * @deprecated
         * @param maskEnabled
         */
        public setMaskEnabled(maskEnabled:boolean){
            this._setMaskEnabled(maskEnabled);
        }
        /**
         * @deprecated
         */
        public isMaskEnabled():boolean{
            return this._nodeOption.maskEnabled;
        }

        /**
         * 加载资源，可以是egret.Texture或路径
         * @param {String||egret.Texture} fileName
         * @param {Function} cb
         * @param {Function} target
         */
        public loadTexture (fileName:any, cb?:Function, target?:any):void {
            var self = this, nodeOption = self._nodeOption;

            res.getStatusRes(fileName, function(resData){
                nodeOption.texture = resData;
                self._setWidth(resData.textureWidth);
                self._setHeight(resData.textureHeight);

                if(nodeOption.maskTextureFile && nodeOption.maskEnabled){
                    nodeOption.texture = self._makeMaskedTexture();
                }

                if (cb) cb.call(target, self);
            }, self, egret.Texture);
        }

        /**
         * 设置蒙版Texture
         * @param fileName
         */
        public loadMaskTexture (fileName:string):void {
            var self = this, nodeOption = self._nodeOption;
            nodeOption.maskTextureFile = fileName;
        }

        /**
         * @private
         */
        private _makeMaskedTexture (){
            var self = this, nodeOption = self._nodeOption;
            var renderTextureContainer = new egret.DisplayObjectContainer();

            var maskSprite = new egret.Bitmap();
            maskSprite.texture = res.getRes(nodeOption.maskTextureFile);
            maskSprite.blendMode = "clear";
            renderTextureContainer.addChild(maskSprite);

            var image = new egret.Bitmap();
            image.texture = nodeOption.texture;
            image.blendMode = "mask";
            renderTextureContainer.addChild(image);

            var renderTexture:egret.RenderTexture = new egret.RenderTexture();
            renderTexture.drawToTexture(renderTextureContainer);

            return renderTexture;
        }
        //@override
        dtor(){
            super.dtor();
            var rt:any = this._nodeOption.texture;
            if(rt instanceof egret.RenderTexture){
                rt.dispose();
            }
        }

        /**
         * 设置特殊属性
         * @Override
         * @param imageView
         */
        public copySpecialProps (imageView:UIImage):void {
            var self = this, nodeOption2 = imageView._nodeOption;
            self.loadTexture(nodeOption2.texture);
        }


        //===============extend 开始============
        setOption(option){
            if(option == null) return option;
            var self = this;
            self._nodeOption.currDynamicImg = null;
            option = super.setOption.call(self, option);
            if(option.value) {
                self.loadTexture(option.value);
            }
            return option;
        }

        public setDynamicImg(img:any, defImg?:any){
            var self = this, nodeOption = self._nodeOption;
            if(defImg){
                self.setOption(defImg);
            }
            nodeOption.currDynamicImg = img;
            res.load([img], (function(){
                if(nodeOption.currDynamicImg == this.img) self.setOption(img);
            }).bind({img:img}));
        }

        public setHighLight(){
            this.blendMode = egret.BlendMode.ADD;
        }

        public _render(renderContext:egret.RendererContext):void {
            var self = this, texture = self._nodeOption.texture;
            self._texture_to_render = texture;
            if(texture){
                var destW:number = self._hasWidthSet?self._explicitWidth:texture._textureWidth;
                var destH:number = self._hasHeightSet?self._explicitHeight:texture._textureHeight;
                egret.Bitmap._drawBitmap(renderContext,destW,destH,self);
            }

            super._render(renderContext);
        }
        //===============extend 结束============
    }
}
