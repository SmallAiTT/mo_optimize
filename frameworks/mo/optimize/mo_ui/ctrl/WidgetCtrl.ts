module mo_ui {

    export class WidgetCtrl extends mo_base.Class{
        static __className:string = "WidgetCtrl";

        _jsonPath:string;
        _clickWidgetName:string;
        _clickFunc:Function;
        _clickTarget:any;
        _clickData:any;
        _gridScrollView:GridScrollView;

        _widget:UIWidget;
        _setWidget(widget:UIWidget){
            var self = this;
            var E = egret.Event;
            var oldWidget = self._widget;
            if(oldWidget){//如果之前就有了，就进行绑定解除
                (<any>oldWidget).controller = null;//强制赋值
                self._removeClickEvent();
                oldWidget.removeEventListener(E.ADDED_TO_STAGE, self.onEnter, self);
                oldWidget.removeEventListener(E.REMOVED_FROM_STAGE, self.onExit, self);
                oldWidget.removeEventListener("dtor", self.dtor, self);
                oldWidget.isAutoDtor = true;//统一转移给ctrl管理
            }
            self._widget = widget;
            if(!widget) return;
            (<any>widget).controller = self;//强制赋值
            self._initClickEvent();
            widget.addEventListener(E.ADDED_TO_STAGE, self.onEnter, self);
            widget.addEventListener(E.REMOVED_FROM_STAGE, self.onExit, self);
            //由于getInstance会在设置_isInstance之前就调用了该方法，所以要延迟到下一帧执行
            process.nextTick(function(){
                if(self._isInstance){
                    widget.isAutoDtor = false;
                }
                if(!self._isInstance){
                    widget.addEventListener("dtor", self.dtor, self);
                }
            });
        }
        public set widget(widget:UIWidget){
            this._setWidget(widget);
        }
        public get widget():UIWidget{
            return this._widget;
        }


        set isAutoDtor(isAutoDtor:boolean){
            var widget = this.widget;
            if(widget){
                widget.isAutoDtor = isAutoDtor;
            }
        }
        get isAutoDtor():boolean{
            return this.widget.isAutoDtor;
        }

        //@override
        _initProp() {
            super._initProp();
        }

        //@override
        _init() {
            super._init();
        }

        resetByData(data:any, ...args:any[]){
            logger.warn(mo_code.c_103);
        }

        _eventStoreForClass:any[];
        resModuleName:string;
        dtor(){
            super.dtor();
            var self = this;
            var eventStoreForClass:any[] = self._eventStoreForClass;
            if(eventStoreForClass){
                var l = eventStoreForClass.length;
                for(var i = l - 1; i >= 0; --i){
                    var info = eventStoreForClass[i];
                    info[0].unregisterByKey(info[1], info[2], self);
                }
                eventStoreForClass.length = 0;
            }
            self._setWidget(null);
        }

        registerClassByKey(clazz:any, key:string, listener:Function){
            mo.registerClassByKey(this, clazz, key, listener);
        }


        init(...args:any[]){
            var self = this;
            if(self._jsonPath){
                var widget = uiReader.genWidget(self._jsonPath);
                self.widget = widget;
                self.setClickEnabled(false);
            }
        }

        onEnter(){
            // do nothing
        }

        onExit(){
        }

        setClickEnabled(enabled:boolean){
            var self = this;
            if(self._clickWidgetName){
                var widget = self.getWidgetByName(self._clickWidgetName);
                if(widget){
                    widget.touchEnabled = enabled;
                }
            }
        }

        _initClickEvent(){
            var self = this;
            if(self._clickWidgetName){
                var widget = self.getWidgetByName(self._clickWidgetName);
                if(widget){
                    widget.onClick(function(sender){
                        if(self._clickFunc){
                            mo_evt.dispatchEvent([
                                [mo_evt.widgetCtrlClickDispatcher, self.__className],
                            ], self._doClick, self, sender);
                        }
                    }, self);
                }
            }
        }
        _removeClickEvent(){
            var self = this;
            if(self._clickWidgetName){
                var widget = self.getWidgetByName(self._clickWidgetName);
                if(widget){
                    widget.onClick(null, null);
                }
            }
        }

        /**
         * 创建gridScrollView方法。不需要设置viewSize和cellSize。
         * @param panelName
         * @param cellClass
         * @param cols
         * @param onCellDataSource
         * @param autoCellWidth
         * @returns {GridScrollView}
         * @private
         */
        _createGridScrollView(panelName:string, cellClass:any, cols:number, onCellDataSource:Function, autoCellWidth?:boolean){
            var self = this;
            var panel = self.getWidgetByName(panelName);
            var viewSize = panel.getSize();
            var cell = cellClass.create();
            var cellSize = cell.getSize();
            cell.doDtor();
            if(autoCellWidth){
                cellSize = mo.size(viewSize.width/cols, cellSize.height)
            }
            var gridScrollView = self._gridScrollView = GridScrollView.create(
                viewSize, cellSize, cols, 0,
                onCellDataSource, self, cellClass
            );
            panel.addChild(gridScrollView);
            return gridScrollView;
        }

        attachWidgetTo(parent, zorder = 0, tag?){
            var self = this;
            self.detachWidget();
            self.widget.zOrder = zorder;
            parent.addChild(self.widget);
        }

        detachWidget(){
            if(this.widget) this.widget.removeFromParent();
        }

        setLayoutAdaptive(widget, isAdaptiveChildren){
            if(!widget) return;
            var oldWidth = widget.getSize().width;
            var oldHeight = widget.getSize().height;

            widget.setSize(mo.visibleRect.getSize());
            var newWidth = widget.getSize().width;
            var newHeight = widget.getSize().height;

            if(widget.getChildrenCount() > 0 && isAdaptiveChildren){
                var children = widget.getChildren(), tmpChild;
                for (var i = 0; i < children.length; i++) {
                    tmpChild = children[i];
                    if(tmpChild instanceof UIPanel){
                        if(tmpChild.getSize().width == oldWidth){
                            tmpChild.setSize(mo.size(newWidth, tmpChild.getSize().height));
                        }
                        else if(tmpChild.getSize().height == oldHeight){
                            tmpChild.setSize(mo.size(tmpChild.getSize().width, newHeight));
                        }
                    }
                }
            }
        }

        _doClick(sender){
            var self = this;
            self._clickFunc.call(self._clickTarget, self, sender, self._clickData);
        }
        onClick(selector, target, data){
            this._clickFunc = selector;
            this._clickTarget = target;
            this._clickData = data;
        }

        getWidgetByName(name):any{
            if (this.widget.name == name) return this.widget;
            return this.widget.getWidgetByName(name);
        }
    }

}