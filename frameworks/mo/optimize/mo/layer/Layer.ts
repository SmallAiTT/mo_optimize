module mo{
    export class Layer extends Node{
        static __className:string = "Layer";

        static PHASE_SHOW:string = "show";
        static PHASE_HIDE:string = "hide";
        static PHASE_CLOSE:string = "close";

        _showWithAction:boolean;
        _showingWithAction:boolean;//正在进行action的显示
        _setShowingWithAction(showingWithAction:boolean){
            this._showingWithAction = showingWithAction;
        }
        public set showingWithAction(showingWithAction:boolean){
            this._setShowingWithAction(showingWithAction);
        }
        public get showingWithAction():boolean{
            return this._showingWithAction;
        }

        /** 是否自动进行背景模糊遮罩 */
        _blurMaskEnabled:boolean;
        _setBlurMaskEnabled(blurMaskEnabled:boolean){
            this._blurMaskEnabled = blurMaskEnabled;
        }
        public set blurMaskEnabled(blurMaskEnabled:boolean){
            this._setBlurMaskEnabled(blurMaskEnabled);
        }
        public get blurMaskEnabled():boolean{
            return this._blurMaskEnabled;
        }

        _onCloseFunc(){}
        _onCloseTarget:any;

        _onShowFunc(){}
        _onShowTarget:any;

        _onHideFunc(){}
        _onHideTarget:any;

        _layerResAutoReleased:boolean;//是否自动释放layer对应的资源

        _initProp(){
            super._initProp();
            var self = this;
            self.anchorX = 0;
            self.anchorY = 0;
            var stage = getStage();
            self.width = stage.stageWidth;
            self.height = stage.stageHeight;
            self._setPenetrable(true);//托盘设置为可穿透
            self._showWithAction = false;
            self._showingWithAction = false;
            self._setBlurMaskEnabled(false);//默认是不自动缓存背景texture
            self._layerResAutoReleased = true;
        }

        _doDtor(){
            var self = this;
            var children = self._children;
            for(var i = 0, li = children.length; i < li; ++i){
                var child:any = children[i];
                if(child && child.isAutoDtor && !child._isInstance && child.doDtor){
                    child.doDtor();
                }
            }
            self.dtor();
        }

        //@override layer需要做特殊处理，因为有可能注册了after_close方法。如果注册了改方法，则需要延迟到下一秒才能释放
        doDtor(){
            var self = this;
            var nodeOption = self._nodeOption;
            if(nodeOption.hasDtored) return;//证明已经释放过了
            nodeOption.hasDtored = true;
            var afterType1 = mo_evt.Event.getAfterEventType(gEventType.invisible);
            var afterType2 = mo_evt.Event.getAfterEventType(Layer.PHASE_CLOSE);
            if(self.willTrigger(afterType1) || self.willTrigger(afterType2)){//如果出现了这两个类型的事件注册，则需要推迟一秒进行释放
                process.nextTick(function(){
                    self._doDtor();
                });
            }else{
                self._doDtor();
            }
        }
        dtor(){
            super.dtor();
            var self = this;

            if(self._layerResAutoReleased){
                var resArr = res.getResArr(self.__className);
                if(resArr){
                    res.unload(resArr);
                }else{
                    logger.warn("为找到【%s】有对应的资源配置！", self.__className);
                }
            }

            self._onShowFunc = null;
            self._onShowTarget = null;
            self._onHideFunc = null;
            self._onHideTarget = null;
            self._onCloseFunc = null;
            self._onCloseTarget = null;
        }

        _getShowAction(cb):egret.action.Action{
            var self = this;

            var scaleTime = self.getScale();
            self.setScale(scaleTime * 0.85);

            var scaleTo = mo_act.scaleTo(0.4, scaleTime).setEase(mo_act.Ease.backOut);
            return mo_act.sequence(scaleTo, mo_act.callFunc(cb));
        }
        _onShowReady(){
            //子类在此处理显示完毕的操作
            this._showingWithAction = false;
            this.visible = true;
        }
        _doShow(){
            var self = this;
            if(self._showWithAction){
                self._showingWithAction = true;
                var runAction = function(){
                    var cb = arguments[arguments.length - 1];
                    var action = self._getShowAction(function(){
                        self._onShowReady();
                        cb();
                    });
                    self.visible = true;
                    self.runAction(action);
                };
                mo_evt.dispatchEventWidthCallback([
                    [mo_evt.visibleDispatcher, self.__className],
                    [self, Layer.PHASE_SHOW],
                    [self, gEventType.visible]
                ], runAction, self);
            }else{
                mo_evt.dispatchEvent([
                    [mo_evt.visibleDispatcher, self.__className],
                    [self, Layer.PHASE_SHOW],
                    [self, gEventType.visible]
                ], self._onShowReady, self);
            }
        }
        public show(){
            this._doShow();
        }
        _showWithoutAction(){
            var self = this;
            mo_evt.dispatchEvent([
                [mo_evt.visibleDispatcher, self.__className],
                [self, Layer.PHASE_SHOW],
                [self, gEventType.visible]
            ], self._onShowReady, self);
        }

        _onHide(){
            //子类在此处理隐藏完毕的操作
            this.visible = false;
        }
        _doHide(){
            var self = this;
            mo_evt.dispatchEvent([
                [mo_evt.invisibleDispatcher, self.__className],
                [self, Layer.PHASE_HIDE],
                [self, gEventType.invisible]
            ], self._onHide, self);
        }
        public hide(){
            this._doHide();
        }

       _onClose(){
           var self = this;
           self.removeFromParent();
       }
        _doClose(){
            var self = this;
            mo_evt.dispatchEvent([
                [mo_evt.invisibleDispatcher, self.__className],
                [self, Layer.PHASE_CLOSE],
                [self, gEventType.invisible]
            ], self._onClose, self);
        }

        //关闭，改方法会将自身从父节点移除
        public close(){
            this._doClose();
        }

        //注册关闭回调 只能先这样先改成any型
        onClose(listener:any, ctx?:any){
            var self = this, clazz = self.__class;
            if(self._onCloseFunc){
                mo_evt.removeAfterEventListener(self, clazz.PHASE_CLOSE, self._onCloseFunc, self._onCloseTarget);
            }

            self._onCloseFunc = listener;
            self._onCloseTarget = ctx;
            mo_evt.addAfterEventListener(self, clazz.PHASE_CLOSE, listener, ctx);
        }

        //注册显示回调 只能先这样先改成any型
        onShow(listener:any, ctx?:any){
            var self = this, clazz = self.__class;
            if(self._onShowFunc) {
                mo_evt.removeAfterEventListener(self, clazz.PHASE_SHOW, self._onShowFunc, self._onShowTarget);
            }

            self._onShowFunc = listener;
            self._onShowTarget = ctx;
            mo_evt.addAfterEventListener(self, clazz.PHASE_SHOW, listener, ctx);
        }

        //注册隐藏回调 只能先这样先改成any型
        onHide(listener:any, ctx?:any){
            var self = this, clazz = self.__class;
            if(self._onHideFunc){
                mo_evt.removeAfterEventListener(self, clazz.PHASE_HIDE, self._onHideFunc, self._onHideTarget);
            }

            self._onHideFunc = listener;
            self._onHideTarget = ctx;
            mo_evt.addAfterEventListener(self, clazz.PHASE_HIDE, listener, ctx);
        }

    }
}