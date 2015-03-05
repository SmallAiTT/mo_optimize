module mo_ui {
    export class UITextAtlas extends UIWidget {
        static __className:string = "UITextAtlas";

        static NODE_OPTION_CLASS = mo_opt._UITextAtlasOption;

        _nodeOption:mo_opt._UITextAtlasOption;//子类重新声明下类型而已

        constructor(str?:string, textureFile?:string, itemWidth?:number, itemHeight?:number, startCharMap?:string) {
            super();
            if(str != null) this.setProperty.apply(this, arguments);
        }

        public setProperty (str:string, textureFile:string, itemWidth:number = 0, itemHeight:number = 0, startCharMap:string = " "){
            var self = this, nodeOption = self._nodeOption;
            nodeOption.textureFile = textureFile;

            var texture:egret.Texture = res.getRes(textureFile);

            nodeOption.spriteSheet = res.getRes(textureFile + ".SpriteSheet");
            nodeOption.string = str;
            nodeOption.itemWidth = itemWidth;
            nodeOption.itemHeight = itemHeight;
            nodeOption.mapStartChar = startCharMap;

            nodeOption.itemsPerColumn = Math.round(texture.textureHeight / nodeOption.itemHeight);
            nodeOption.itemsPerRow = Math.round(texture.textureWidth / nodeOption.itemWidth);

            self.setText(str);
            if(!nodeOption.spriteSheet){
                nodeOption.spriteSheet = new egret.SpriteSheet(texture);
                self._updateSpriteSheet();
            }
        }

        private _updateSpriteSheet() {
            console.log("_updateSpriteSheet")
            var self = this, nodeOption = self._nodeOption;
            var texture_scale_factor = egret.MainContext.instance.rendererContext.texture_scale_factor;
            var locItemWidth = nodeOption.itemWidth /texture_scale_factor ,
                locItemHeight = nodeOption.itemHeight / texture_scale_factor,
                firstCharCode = nodeOption.mapStartChar.charCodeAt(0),

                itemsPerColumn = nodeOption.itemsPerColumn,
                itemsPerRow = nodeOption.itemsPerRow;

            var spriteSheet = nodeOption.spriteSheet, word;
            for(var i = 0; i< itemsPerColumn;i++){
                for(var j = 0; j < itemsPerRow;j++){
                    word = String.fromCharCode(firstCharCode + i * itemsPerRow + j);
                    spriteSheet.createTexture(word,
                            j * locItemWidth,
                            i * locItemHeight,
                        locItemWidth,
                        locItemHeight
                    );
                }
            }

            res._pool[nodeOption.textureFile + ".SpriteSheet"] = spriteSheet;
        }

        public _render(renderContext:egret.RendererContext):void {
            var self = this, nodeOption = self._nodeOption;
            var locString:string = nodeOption.string;
            var n = locString.length;

            var renderFilter = egret.RenderFilter.getInstance();
            var texture, spriteSheet = nodeOption.spriteSheet;
            var xPos:number = 0;
            for (var i = 0; i < n; i++) {
                var word = locString[i];
                texture = spriteSheet.getTexture(word);

                var bitmapWidth:number = texture._bitmapWidth||texture._textureWidth;
                var bitmapHeight:number = texture._bitmapHeight||texture._textureHeight;
                this._texture_to_render = texture;
                renderFilter.drawImage(renderContext, this, texture._bitmapX, texture._bitmapY,
                    bitmapWidth, bitmapHeight, xPos+texture._offsetX, texture._offsetY, bitmapWidth,bitmapHeight);
                xPos += texture._textureWidth;
            }

            this._texture_to_render = null;
        }

        public getText():string {
            return this._nodeOption.string;
        }

        public setText(label:string) {
            var self = this;
            var nodeOption = self._nodeOption;
            nodeOption.string = label;
            var locItemWidth = nodeOption.itemWidth,
                locItemHeight = nodeOption.itemHeight;

            var len = label.length;
            self._setWidth(len * locItemWidth);
            self._setHeight(locItemHeight);
        }

        public copySpecialProps (labelAtlas:UITextAtlas) {
            var nodeOption2 = labelAtlas._nodeOption;
            this.setProperty(nodeOption2.string, nodeOption2.textureFile, nodeOption2.itemWidth, nodeOption2.itemHeight, nodeOption2.mapStartChar);
        }

        setOption (option:any):any{
            if(option == null) return option;
            var self = this;
            option = super.setOption(option);
            if(option.value != null) self.setText(option.value + "");
            return option;
        }
    }
}
