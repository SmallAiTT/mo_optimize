module mo{
    export class Tray extends Layer{
        public static __className:string = "Tray";//为了跟cocos方案保持一致所写

        //@override
        _initProp(){
            super._initProp();
            var self = this;
            self.visible = false;//默认隐藏
            self._setTouchEnabled(true);//设置成可点击
            self._setPenetrable(true);//托盘设置为可穿透
            self.isAutoDtor = true;//都设置成自动释放
            self._layerStackToHide = [];
        }

        _forceHidden:boolean;
        _setForceHidden(forceHidden:boolean){
            this._forceHidden = forceHidden;
        }
        public set forceHidden(forceHidden:boolean){
            this._setForceHidden(forceHidden);
        }
        public get forceHidden():boolean{
            return this._forceHidden;
        }
        //判断当前托盘是否显示
        _judgeToShow(){
            var self = this;
            if(self._forceHidden) {
                if(self.visible) self.hide();
                return;
            }
            var children = self._children;
            var visible = false;
            for(var i = 0, li = children.length; i < li; ++i){
                if(children[i].parent != null && children[i].visible) {
                    visible = true;
                    break;
                }
            }
            if(!self.visible && visible) self.show();
            else if(self.visible && !visible) self.hide();
        }
        _onLayerInvisible(event:mo_evt.Event){
            var self = this;
            var layer:Layer = <Layer>event.target;

            mo_evt.removeAfterEventListener(layer, event.type, self._onLayerInvisible, self);
            if(layer.blurMaskEnabled){
                self.recoverLayers();
                var parent:any = self.parent;
                if(parent) parent.recoverTrays();
                var blurMaskLayer = layer["blurMaskLayer"];
                if(blurMaskLayer) blurMaskLayer.removeFromParent();
                layer["blurMaskLayer"] = null;
            }
            self._judgeToShow();

        }
        public add(layer:Layer){
            var self = this;
            //先移除一次，避免想单例这种重复添加的问题
            mo_evt.removeAfterEventListener(layer, Layer.PHASE_CLOSE, self._onLayerInvisible, self);
            (<any>layer).hideUnder = false;
            if(layer.blurMaskEnabled){
                logger.debug("add blurMask");
                var oldBlurMaskLayer:BlurMaskLayer = layer["blurMaskLayer"];
                var blurMaskLayer = BlurMaskLayer.create();
                layer["blurMaskLayer"] = blurMaskLayer;
                self.addChild(blurMaskLayer);//添加模糊蒙版到视图里面了
                (<any>self.parent).hideTraysUnder(self);//TODO scene的方法，用any只是移植时解决编译报错问题。
                self.hideLayersUnder(blurMaskLayer);
                if(oldBlurMaskLayer) oldBlurMaskLayer.removeFromParent();
            }
            self.addChild(layer);
            self._judgeToShow();
            mo_evt.addAfterEventListener(layer, Layer.PHASE_CLOSE, self._onLayerInvisible, self);
        }

        _onNodeInvisible(event:egret.Event){
            var self = this;
            var node = event.target;
            node.removeEventListener(event.type, self._onNodeInvisible, self);
            self._judgeToShow();
        }

        //让tray能够添加node
        public addNode(node:Node){
            var self = this;
            self.addChild(node);
            self._judgeToShow();
            node.addEventListener(Node.REMOVE_FROM_PARENT, self._onNodeInvisible, self);
        }


        _layerStackToHide:Layer[][];
        hideLayersUnder(layer:Layer){
            var children = this._children, li = children.length;
            var arr = [];
            for(var i = 0; i < li; ++i){
                var child = children[i];
                if(child == layer){//相等是就退出
                    break;
                }
                if(child.visible){//可见时才进行推送入栈
                    arr.push(child);
                    (<any>child).hideUnder = true;//设置成隐藏在后面
                    if(child instanceof mo.Layer){//如果是layer
                        (<mo.Layer>child).hide();
                    }else{//设置成不可见
                        child.visible = false;
                    }
                }
            }
            this._layerStackToHide.push(arr);
        }
        recoverLayers(){
            var arr:Layer[] = this._layerStackToHide.pop();
            if(arr){
                for(var i = 0; i < arr.length; ++i){
                    var child = arr[i];
                    (<any>child).hideUnder = false;//设置成不隐藏在后面
                    if(child instanceof mo.Layer){//如果是layer
                        (<mo.Layer>child)._showWithoutAction();
                    }else{
                        arr[i].visible = true;
                    }
                }
            }
        }
    }
}