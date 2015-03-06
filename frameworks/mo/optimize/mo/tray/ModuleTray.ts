module mo{
    export class ModuleTray extends Tray{
        static __className:string = "ModuleTray";

        _moduleLayerMap:any;
        _moduleNameStack:string[];
        _moduleName:string;//当前模块
        _moduleLayer:Layer;//当前的模块layer
        _defaultModuleName:string;//默认的模块名称

        //@override
        _initProp(){
            super._initProp();
            var self = this;
            self._moduleLayerMap = {};
            self._moduleNameStack = [];
            self._defaultModuleName = "__DEFAULT__";
            self._moduleLayer = new mo.Layer();
            self.visible = true;//模块托盘默认可见
            self.addChild(self._moduleLayer);
        }

        //注意，这里，之前的layer还没有隐藏
        public pushModule(moduleName:string){
            var self = this;
            //创建一个新的layer
            var layer = self._moduleLayer = new mo.Layer();
            self._moduleLayerMap[moduleName] = layer;
            if(self._moduleName) self._moduleNameStack.push(self._moduleName);//推入栈
            self._moduleName = moduleName;
            self.addChild(layer);//添加到托盘中
        }
        public popModule(){
            var self = this;
            var curModuleLayer = self._moduleLayer;
            var nextModuleName = self._moduleNameStack.pop();
            if(nextModuleName){//如果有下一个模块
                var nextModuleLayer = self._moduleLayerMap[nextModuleName];
                self._moduleName = nextModuleName;
                self._moduleLayer = nextModuleLayer;
                delete self._moduleLayerMap[nextModuleName];//删除字典内数据
                nextModuleLayer.show();//设置成可见
                self.removeChild(curModuleLayer);//移除
            }else{
                self._moduleName = null;
                self._moduleLayer = null;
            }
        }

        public hideLayersInStack(){
            var stack = this._moduleNameStack;
            var map = this._moduleLayerMap;
            for(var i = 0, li = stack.length; i < li; ++i){
                var layer:Layer = map[stack[i]];
                layer.hide();
            }
        }

        //@override
        public add(layer:Layer){
            var curModuleLayer = this._moduleLayer;
            if(curModuleLayer){
                curModuleLayer.addChild(layer);
            }else{
                logger.warn("当前托盘还未创建ModuleLayer");
            }
        }
    }
}