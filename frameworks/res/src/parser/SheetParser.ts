module res{
    var _ = res;

    export class FrameData{
        public name:string;
        public x:number;
        public y:number;
        public w:number;
        public h:number;
        public offX:number;
        public offY:number;
        public sourceW:number;
        public sourceH:number;
        public scale9grid:string;
        public rotated:boolean;
        public trimmed:boolean;
    }

    export class SheetData{
        public frames:FrameData[]
    }

    export class SheetParser extends ResParser{
        private _imageCfgItem:ResCfgItem;
        private _dataCfgItem:ResCfgItem;

        constructor(){
            super();
            var self = this;
            self.addEventListener(egret.Event.COMPLETE, self._onLoadFinish, self);
            self.addEventListener(egret.IOErrorEvent.IO_ERROR, self._onLoadFinish, self);
        }

        //@override
        public load(resCfgItem:any, cb:(data:any, resCfgItem:ResCfgItem)=>void, ctx?:any):void{
            //这里调用URLLoader去进行资源的加载
            var self = this;
            var resCfgItem1 = self._dataCfgItem = new ResCfgItem();
            resCfgItem1.type = "json";
            resCfgItem1.name = resCfgItem.name + "_json";
            resCfgItem1.url = path2.changeExtname(resCfgItem.url, ".json");

            var resCfgItem2 = self._imageCfgItem = new ResCfgItem();
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
            var resCfgItem:ResCfgItem = itemInfo.item;
            var compFunc:Function = itemInfo.cb;
            var result:any;
            if(event.type==egret.Event.COMPLETE){
                result = self._cache(resCfgItem, self._parse(resCfgItem, eventData[1]));
            }else{
                self._handleError(event, resCfgItem);
            }
            compFunc.call(itemInfo.ctx, result, resCfgItem);
        }

        public _parseSheetData(data:any):SheetData{
            var sheetData = new SheetData();
            var frames:any[] = data["frames"];
            var tempFrames = [];
            for(var i = 0; i < frames.length; ++i){
                var frame = frames[i];
                var frameData = new FrameData();
                tempFrames.push(frameData);
                frameData.name = frame["filename"];
                frameData.x = frame["frame"]["x"];
                frameData.y = frame["frame"]["y"];
                frameData.w = frame["frame"]["w"];
                frameData.h = frame["frame"]["h"];
                frameData.sourceW = frame["sourceSize"]["w"];
                frameData.sourceH = frame["sourceSize"]["h"];
                frameData.scale9grid = frame["scale9grid"];
                frameData.rotated = frame["rotated"];
                frameData.trimmed = frame["trimmed"];
                frameData.offX = frame["spriteSourceSize"]["x"];
                frameData.offY = frame["spriteSourceSize"]["y"];
            }
            sheetData.frames = tempFrames;
            return sheetData;
        }

        //@override
        public _parse(resCfgItem:ResCfgItem, results:any[]):any{
            var sheetData:SheetData = this._parseSheetData(results[0]);
            var texture:egret.Texture = results[1];
            var frames:FrameData[] = sheetData.frames;
            if(!frames){
                return null;
            }
            var spriteSheet:egret.SpriteSheet = new egret.SpriteSheet(texture);
            for(var i = 0; i < frames.length; ++i){
                var frameData:FrameData = frames[i];
                var rotated = frameData.rotated;
                var w:number = rotated ? frameData.h : frameData.w;
                var h:number = rotated ? frameData.w : frameData.h;
                var texture:egret.Texture = spriteSheet.createTexture(
                    frameData.name,
                    frameData.x, frameData.y, w, h,
                    frameData.offX, frameData.offY,
                    frameData.sourceW,frameData.sourceH
                );
                if(rotated) texture["rotation"] = 90;
                if(frameData.scale9grid){
                    var str:string = frameData.scale9grid;
                    var list:Array<string> = str.split(",");
                    texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]),parseInt(list[1]),parseInt(list[2]),parseInt(list[3]));
                }
            }
            return spriteSheet;
        }
    }
    //@override
    SheetParser.TYPE = "sheet";
    registerParser(SheetParser, "sheet");
}