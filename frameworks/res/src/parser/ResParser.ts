module res{
    var _ = res;
    export class ResParser extends egret.EventDispatcher{
        static TYPE:string = "base";
        /**
         * 加载项字典
         */
        public _itemInfoDic:any = {};

        public _dataFormat:string = egret.net.URLLoaderDataFormat.BINARY;
        /**
         * URLLoader对象池
         */
        public _recycler:egret.Recycler = new egret.Recycler();

        /**
         * 获取一个URLLoader对象
         */
        public _getLoader():egret.net.URLLoader{
            var self = this;
            var loader:egret.net.URLLoader = self._recycler.pop();
            if(!loader){
                loader = new egret.net.URLLoader();
                loader.addEventListener(egret.Event.COMPLETE, self._onLoadFinish, self);
                loader.addEventListener(egret.IOErrorEvent.IO_ERROR, self._onLoadFinish, self);
            }
            loader.dataFormat = self._dataFormat;
            return loader;
        }

        /**
         * 获得真正的url
         * @param resCfgItem
         * @returns {string}
         */
        public getRealUrl(resCfgItem:ResCfgItem):string{
            return path.join(_.root, resCfgItem.url);
        }

        /**
         * 资源加载。
         * @param resCfgItem
         * @param cb
         * @param ctx
         */
        public load(resCfgItem:any, cb:(data:any, resCfgItem:ResCfgItem)=>void, ctx?:any):void{
            //这里调用URLLoader去进行资源的加载
            var self = this;
            var loader:egret.net.URLLoader = self._getLoader();
            self._itemInfoDic[loader.hashCode] = {item:resCfgItem, cb:cb, ctx:ctx};
            loader.load(new egret.net.URLRequest(self.getRealUrl(resCfgItem)));
        }

        /**
         * 资源释放
         * @param resCfgItem
         */
        public distory(resCfgItem:ResCfgItem):void{
            //进行资源销毁
            delete _._pool[resCfgItem.name]
        }

        /**
         * 解析资源内容
         * @param resCfgItem
         * @param data
         * @returns {any}
         */
        public _parse(resCfgItem:ResCfgItem, data:any):any{
            //这里进行内容的处理，将处理完的结果返回
            return data;
        }

        /**
         * 缓存资源内容
         * @param resCfgItem
         * @param parseResult
         * @returns {any}
         * @private
         */
        public _cache(resCfgItem:ResCfgItem, parseResult):any{
            //这里对解析结果进行缓存操作，将缓存的数据返回
            _._pool[resCfgItem.name] = parseResult;
            return parseResult;
        }
        /**
         * 一项加载结束
         */
        public _onLoadFinish(event:egret.Event):void{
            var self = this;
            var loader:egret.net.URLLoader = <egret.net.URLLoader> (event.target);
            var itemInfo:any = self._itemInfoDic[loader.hashCode];
            var data:any = loader.data;
            delete self._itemInfoDic[loader.hashCode];
            self._recycler.push(loader);
            var resCfgItem:ResCfgItem = itemInfo.item;
            var compFunc:Function = itemInfo.cb;
            var result:any;
            if(event.type==egret.Event.COMPLETE){
                result = self._cache(resCfgItem, self._parse(resCfgItem, data));
            }else{
                self._handleError(event, resCfgItem);
            }
            compFunc.call(itemInfo.ctx, result, resCfgItem);
        }

        public _handleError(event:egret.IOErrorEvent, resCfgItem:ResCfgItem):void{
            //在此处理异常信息
            if(resCfgItem.logEnabled) console.error(event);
        }
    }
}