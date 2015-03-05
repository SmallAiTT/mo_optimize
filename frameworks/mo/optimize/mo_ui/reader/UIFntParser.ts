module mo_ui._parser{

    export class FontDef extends mo.Rect{
        public charID:string;
        public xOffset:number = 0;
        public yOffset:number = 0;
        public xAdvance:number = 0;
    }

    export class UIFntParser extends res.ResParser{
        private _imageCfgItem:res.ResCfgItem;
        private _dataCfgItem:res.ResCfgItem;

        //@override
        public _dataFormat:string = egret.URLLoaderDataFormat.TEXT;

        constructor(){
            super();
            var self = this;
            self.addEventListener(egret.Event.COMPLETE, self._onLoadFinish, self);
            self.addEventListener(egret.IOErrorEvent.IO_ERROR, self._onLoadFinish, self);
        }

        //@override
        public load(resCfgItem:any, cb:(data:any, resCfgItem:res.ResCfgItem)=>void, ctx?:any):void{
            //这里调用URLLoader去进行资源的加载
            var self = this;
            var resCfgItem1 = self._dataCfgItem = new res.ResCfgItem();
            resCfgItem1.type = res.TextParser.TYPE;
            resCfgItem1.name = resCfgItem.name + "_fnt";
            resCfgItem1.url = path2.changeExtname(resCfgItem.url, ".fnt");

            var resCfgItem2 = self._imageCfgItem = new res.ResCfgItem();
            resCfgItem2.type = "image";
            resCfgItem2.name = resCfgItem.name + "_png";
            resCfgItem2.url = path2.changeExtname(resCfgItem.url, ".png");
            res.load([resCfgItem1, resCfgItem2], function(err, results){
                if(err || results.length != 2){
                    var event = new egret.Event(egret.IOErrorEvent.IO_ERROR);
                    self.dispatchEvent(event);
                }else{
                    var event = new egret.Event(egret.Event.COMPLETE);
                    event.data = [{item:resCfgItem, cb:cb, ctx:ctx}, results];
                    self.dispatchEvent(event);
                }
            });
        }
        /**
         * 一项加载结束
         */
        public _onLoadFinish(event:egret.Event):void{
            var self = this;
            var eventData = event.data;
            var itemInfo:any = eventData[0];
            var resCfgItem:res.ResCfgItem = itemInfo.item;
            var compFunc:Function = itemInfo.cb;
            var result:any;
            if(event.type==egret.Event.COMPLETE){
                result = self._cache(resCfgItem, self._parse(resCfgItem, eventData[1]));
            }else{
                self._handleError(event, resCfgItem);
            }
            compFunc.call(itemInfo.ctx, result, resCfgItem);
        }

        //@override
        public _parse(resCfgItem:res.ResCfgItem, results:any[]):any{
            var textData = results[0];
            var Texture = results[1];

            //创建纹理集
            var spriteSheet = new egret.SpriteSheet(Texture);
            var re, line;
            var fontDefDictionary = {};

            re = /char id=\w[a-z0-9\-= ]+/gi;
            line = textData.match(re);
            if (line) {
                // Parse the current line and create a new CharDef
                for (var i = 0; i < line.length; i++) {
                    var element = this._parseCharDef(line[i]);
                    fontDefDictionary[element.charID] = element;
                }
            }

            for (var key in fontDefDictionary) {
                var fontDef = fontDefDictionary[key];
                var name = String.fromCharCode(fontDef.charID);
                spriteSheet.createTexture(name, fontDef.x, fontDef.y, fontDef.width, fontDef.height, fontDef.xOffset, fontDef.yOffset);
            }

            return spriteSheet;
        } 

        private _parseCharDef (line:string) {
            var charDef = new FontDef();

            // Character ID
            var value = /id=(\d+)/gi.exec(line)[1];
            charDef.charID = value.toString();

            // Character x
            value = /x=([\-\d]+)/gi.exec(line)[1];
            charDef.x = parseInt(value);

            // Character y
            value = /y=([\-\d]+)/gi.exec(line)[1];
            charDef.y = parseInt(value);

            // Character width
            value = /width=([\-\d]+)/gi.exec(line)[1];
            charDef.width = parseInt(value);

            // Character height
            value = /height=([\-\d]+)/gi.exec(line)[1];
            charDef.height = parseInt(value);

            // Character xoffset
            value = /xoffset=([\-\d]+)/gi.exec(line)[1];
            charDef.xOffset = parseInt(value);

            // Character yoffset
            value = /yoffset=([\-\d]+)/gi.exec(line)[1];
            charDef.yOffset = parseInt(value);

            // Character xadvance
            value = /xadvance=([\-\d]+)/gi.exec(line)[1];
            charDef.xAdvance = parseInt(value);

            return charDef;
        }
    }
    //@override
    UIFntParser.TYPE = "bmf";
    res.registerParser(UIFntParser, "bmf");
}