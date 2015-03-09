module mo {


    export class Node extends egret.DisplayObjectContainer{
        static __className:string = "Node";
        public static create(...args:any[]):any{
            return mo_base.Class.create.apply(this, arguments);
        }
        public static createDynamic(...args:any[]):any{
            return mo_base.Class.createDynamic.apply(this, arguments);
        }
        public static getInstance(...args:any[]):any{
            return mo_base.Class.getInstance.apply(this, arguments);
        }
        public static purgeInstance(...args:any[]):any{
            return mo_base.Class.purgeInstance.apply(this, arguments);
        }

        public static NODE_OPTION_CLASS = mo_opt._NodeOption;
        public static TOUCH_OPTION_CLASS = mo_opt._TouchOption;

        static CLICK_NODE:string = "clickNode";
        static NODE_TOUCH_BEGIN:string = "nodeTouchBegin";

        static REMOVE_FROM_PARENT = "removeFromParent";

        __class:any;
        __className:string;

        _dirty:boolean;
        _isInstance:boolean;
        _hasDtored:boolean;
        /**
         * 判断是否需要对子节点列表重新排序
         * @type {boolean}
         * @private
         */
        _reorderChildrenDirty:boolean;

        _nodeOption:mo_opt._NodeOption;//用于存储节点基础参数相关，以降低属性数量
        _touchOption:mo_opt._TouchOption;//用于存储点击相关，以降低属性数量
        extendOption:mo_opt._ExtendOption;//拓展option，用于给对象加外部添加的拓展属性用，避免属性数量过大

        _setZOrder(zOrder:number){
            if(this._parent){
                (<Node>this._parent)._reorderChildrenDirty = true;
            }
            this._nodeOption.zOrder = zOrder;
        }
        public get zOrder():number{
            return this._nodeOption.zOrder;
        }
        public set zOrder(zOrder:number){
            this._setZOrder(zOrder);
        }
        /**
         * @deprecated
         * @param zOrder
         */
        public setZOrder(zOrder:number){
            this._setZOrder(zOrder);
        }
        /**
         * @deprecated
         * @returns {number}
         */
        public getZOrder():number{
            return this._nodeOption.zOrder;
        }


        /**
         * 请注意，子类所有的成员属性都必须在这里赋值，不能直接在声明时候也附上值。
         * @private
         */
        _initProp(){
            var self = this, clazz = self.__class;
            self._nodeOption = new clazz.NODE_OPTION_CLASS();
            self._touchOption = new clazz.TOUCH_OPTION_CLASS();
            self.extendOption = new mo_opt._ExtendOption();
        }
        public constructor() {
            super();
            var self = this;
            self.__class = self["constructor"];
            self.__className = self.__class.__className;
            self._initProp();
            self._init();
        }
        _init(){
        }

        //@override
        _setWidth(width:number){
            var self = this;
            if(self._explicitWidth == width) return;
            super._setWidth(width);
            self._nodeOption.nodeSizeDirty = self._dirty = true;
        }
        //@override
        _setHeight(height:number){
            var self = this;
            if(self._explicitHeight == height) return;
            super._setHeight(height);
            self._nodeOption.nodeSizeDirty = self._dirty = true;
        }


        public init(...args:any[]){

        }

        /**
         * 获取shader
         * @return any
         */
        public getShaderProgram():any {
            //todo
            return null;
        }

        public setParent(parent:any) {
            this._parent = parent;
        }

        public getParent():any {
            return this.parent;
        }

        public setRotation(rotation:number) {
            this.rotation = rotation;
        }

        public getRotation():number {
            return this.rotation;
        }

        public setOpacity(opacity:number) {
            this.alpha = opacity / 255;
        }

        public getOpacity():number {
            return this.alpha * 255;
        }

        public setScale(scaleX:number, scaleY?:number) {
            if(scaleY == null){
                scaleY = scaleX;
            }
            this.scaleX =  scaleX;
            this.scaleY = scaleY;
        }

        public setScaleX(scaleX:number) {
            this.scaleX = scaleX;
        }

        public setScaleY(scaleY:number) {
            this.scaleY = scaleY;
        }

        public getScale():number {
            return this.getScaleX();
        }

        public getScaleY():number {
            return this.scaleY;
        }

        public getScaleX():number {
            return this.scaleX;
        }

        public setName(name:string) {
            this.name = name;
        }

        public getName() {
            return this.name;
        }

        public setTag(tag:string) {
            this._nodeOption.tag = tag;
        }

        public getTag():string {
            return this._nodeOption.tag;
        }

        public setSkewY(skewY:number) {
            this.skewY = skewY;
        }

        public getSkewY():number {
            return this.skewY;
        }

        public setSkewX(skewX:number) {
            this.skewX = skewX;
        }

        public getSkewX():number {
            return this.skewX;
        }

        public setPosition(pos:any, posY?:number) {
            if(posY != null){
                //两个参数
                var x = pos;
                var y = posY;
            }
            else{
                //一个参数时候
                var x = pos.x, y:number = pos.y;
            }
            this._setX(x);
            this._setY(y);
        }

        public getPosition():Point {
            return p(this.x,this.y);
        }

        public setPositionX(x:number) {
            this.x = x;
        }

        public getPositionX():number {
            return this.x;
        }

        public setPositionY(y:number) {
            this.y = y;
        }

        public getPositionY():number {
            return this.y;
        }

        public setVisible(visible:boolean) {
            this.visible = visible;
        }

        public isVisible():boolean {
            return this.visible;
        }

        public setAnchorPoint(pos:any, posY?:number) {
            if(posY != null){
                //两个参数
                var anchorX = pos;
                var anchorY = posY;
            }
            else{
                //一个参数时候
                var anchorX = pos.x, anchorY:number = pos.y;
            }
            this._setAnchorX(anchorX);
            this._setAnchorY(anchorY);
        }

        public getAnchorPoint() {
            return p(this.anchorX, this.anchorY);
        }

        public getAnchorPointInPoints() {
            return p(this.anchorX * this.width, this.anchorY * this.height);
        }

        public setSize(size:any, height?:number){
            if(height != null){
                //两个参数
                var width = size;
            }
            else{
                //一个参数时候
                var width = size.width;
                height = size.height;
            }
            this._setWidth(width);
            this._setHeight(height);
        }

        public getSize(): Size{
            return size(this.width, this.height);
        }

        /**
         * 获取子节点
         * @return {Array<egret.DisplayObject>}
         */
        public getChildren():Array<egret.DisplayObject> {
            return this._children;
        }

        /**
         * 获取Widget的子节点数量
         * @returns {Number}
         */
        getChildrenCount() {
            return this.numChildren;
        }

        public getChildByTag(tag:string) {
            var child;
            var children = this.getChildren();
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                if(child && child.getTag() == tag){
                    return child;
                }
            }
        }

        public removeChildByTag(tag:string){
            var child = this.getChildByTag(tag);
            if(child){
                this.removeChild(child);
            }
            else{
               logger.debug("亲，找不到TAG:%s的Child",tag);
            }
        }

        //todo Shader
        public setShaderProgram() {
        }


        /**=========== Action相关 ===========*/

        /**
         * Action管理器
         * @returns {any}
         */
        getActionManager () {
            return egret.action.Manager.getInstance();
        }

        public runAction(action: egret.action.Action) {
            this.getActionManager().addAction(this, action);
        }

        public pauseSchedulerAndActions() {
            this.getActionManager().pauseTarget(this);
        }

        public resumeSchedulerAndActions() {
            this.getActionManager().resumeTarget(this);
        }

        public numberOfRunningActions() {
            return this.getActionManager().numberOfRunningActionsInTarget(this);
        }

        public stopAllActions() {
            this.getActionManager().removeAllActionsFromTarget(this);
        }

        public stopActionByTag(tag) {
            this.getActionManager().removeActionByTag(tag, this);
        }

        public getActionByTag(tag) {
            return this.getActionManager().getActionByTag(tag, this);
        }

        public stopAction(action) {
            this.getActionManager().removeAction(action);
        }

        /**
         * @deprecated
         * @returns {boolean}
         */
        public isRunning() {//TODO
            return true;
        }

        /*public draw() {
        }*/

        public update(dt:number):void{
        }

        //TODO
        public setColor(color) {

        }
        //TODO
        public getColor() {
        }


        //@override
        _parentChanged(parent:egret.DisplayObjectContainer): void{
            super._parentChanged(parent);
            if(!parent){
                var self:Node = this, nodeOption = self._nodeOption;
                var eventType = self.__class.REMOVE_FROM_PARENT;
                if(self.willTrigger(eventType)){
                    var event = new mo_evt.Event(eventType);
                    self.dispatchEvent(event);
                }
                if(!self._isInstance && self.isAutoDtor){
                    self.doDtor();
                }else if(!self._isInstance){//不是自动释放，并且非单例
                    var factory = nodeOption.factory;
                    if(factory){//如果是通过工厂创建，那么就需要调用回收方法
                        factory.reclaim(self);
                    }
                }
            }
        }

        //@override
        public addChild(child:egret.DisplayObject){
            this._reorderChildrenDirty = true;
            return super.addChild(child);
        }

        /**
         * 对子类进行排序
         */
        public sortChildren():void{//TODO
            this._children.sort(function(node1:Node, node2:Node){
                if((node1.zOrder||0) > (node2.zOrder || 0)) return 1;
                if((node1.zOrder||0) < (node2.zOrder || 0)) return -1;
                return 0;
            });
            this._reorderChildrenDirty = false;
        }

        _onNodeSizeDirty(){}


        //=================与cocos想对应的一些回调的整理 开始==============
        //@override 有点类似visit，但又有些不同，这里做了改造，子类统一都不能覆盖这个方法
        _updateTransform1(){
            var self = this;
            if (!self._visible) return;
            if(self._reorderChildrenDirty) self.sortChildren();
            if(self._dirty){
                self._onBeforeVisit();
                if(self._nodeOption.nodeSizeDirty) self._onNodeSizeDirty();
                self._onVisit();
                self._onUpdateView();
                super._updateTransform();
                self._onAfterVisit();
            }else{
                super._updateTransform();
            }
        }

        _onBeforeVisit(){}
        _onVisit(){
        }
        _onUpdateView(){
        }
        _onAfterVisit(){
            var self = this;
            self._nodeOption.nodeSizeDirty = false;
            self._dirty = false;
        }

        //@override _draw 有点类似visit，但又有些不同。在_updateTransform后面执行
        //@override _onAddToStage 相当于onEnter，现在由于移植，还是加上了onEnter，以后考虑删除onEnter。
        _onAddToStage(){
            super._onAddToStage();
            var self = this;
            if(self._touchEnabled) self._initTouchEvents();//如果可点击，则在进入舞台是自动加上所有的点击事件监听
            self.onEnter();//在这里加上onEnter的定义
            process.nextTick(self.onEnterNextTick, self);
        }
        onEnter(){
            var self = this;
            if(self.touchEnabled){
                self._initTouchEvents();
            }
        }
        onEnterNextTick(){

        }
        //@override _onRemoveFromStage 相当于onExit，现在由于移植，还是加上了onExit，以后考虑删除onExit。
        _onRemoveFromStage(){
            this.pauseSchedulerAndActions();
            super._onRemoveFromStage();
            this.onExit();//在这里加上onExit的定义
        }
        onExit(){
            var self = this;
            self.pauseSchedulerAndActions();
            self.stopAllActions();
            self._removeTouchEvents();
        }


        public getWorldBoxWithoutChildren():Rect{
            var self = this;
            var gp = self.localToGlobal();
            var bounds:egret.Rectangle = egret.DisplayObject.getTransformBounds(self._getSize(self._nodeOption.tempRect), self._worldTransform);
            return mo.rect(gp.x, gp.y, bounds.width, bounds.height);
        }

        //@override
        public getBounds(resultRect?:Rect, calculateAnchor:boolean = true):Rect{
            var rect = super.getBounds.apply(this, arguments);
            if(resultRect) return <Rect>rect;
            return mo.rect(rect.x, rect.y, rect.width, rect.height);
        }

        public localToGlobal(x:number = 0, y:number = 0, resultPoint?:Point):Point{
            var point = super.localToGlobal(x, y, resultPoint);
            if(resultPoint) return <Point>point;
            return mo.p(point.x, point.y);
        }

        //=================与cocos想对应的一些回调的整理 结束==============

        //=============事件设置相关 开始==========================
        //@override
        _setTouchEnabled(touchEnabled:boolean){
            if(this.touchEnabled == touchEnabled) return;
            super._setTouchEnabled(touchEnabled);
            if(touchEnabled){
                this._initTouchEvents();
            }else{
                this._removeTouchEvents();
            }
        }

        /**
         * @deprecated
         * @param touchEnabled
         */
        setTouchEnabled(touchEnabled:boolean){
            this._setTouchEnabled(touchEnabled);
        }

        /**
         * @deprecated
         * @returns {boolean}
         */
        isTouchEnabled():boolean{
            return this.touchEnabled;//TODO 是否加上visible
        }

        _setPenetrable(penetrable:boolean){
            this._nodeOption.penetrable = penetrable;
        }
        public set penetrable(penetrable:boolean){
            this._setPenetrable(penetrable);
        }
        public get penetrable():boolean{
            return this._nodeOption.penetrable;
        }
        /**
         * @deprecated
         * @param penetrable
         */
        public setPenetrable(penetrable:boolean){
            this._setPenetrable(penetrable);
        }
        /**
         * @deprecated
         */
        public isPenetrable():boolean{
            return this._nodeOption.penetrable;
        }

        public set longTouchEnabled(enabled:boolean){
            this._touchOption.longTouchEnabled = enabled;
        }
        public get longTouchEnabled():boolean {
            return this._touchOption.longTouchEnabled;
        }

        public enableLongTouch(respInterval:number = 100, startInterVal:number = 400){
            var self = this, touchOption = self._touchOption;
            self.longTouchEnabled = true;
            touchOption.respInterval = respInterval;
            touchOption.startInterVal = startInterVal;
        }

        _scheduleLongTouchCheck(respInterval, delayTime){
            var self = this, touchOption = self._touchOption;
            touchOption.canLongTouch = true;
            touchOption.longTouchTimeoutId = mo.setTimeout(function(){
                touchOption.canTap = false;
                touchOption.longTouchTimeoutId = null;
                if(touchOption.canLongTouch){
                    touchOption.longTouchEventInterValId = mo.setInterval(self._emitLongTouchBegan, self, respInterval);
                }else{
                    touchOption.longTouchEventInterValId = null;
                }
            }, self, delayTime)
        }
        _unscheduleLongTouchCheck(){
            var self = this, touchOption = self._touchOption;
            if(touchOption.longTouchTimeoutId !=null){
                mo.clearTimeout(touchOption.longTouchTimeoutId);
                touchOption.longTouchTimeoutId = null;
            }
            if(touchOption.longTouchEventInterValId !=null){
                mo.clearInterval(touchOption.longTouchEventInterValId);
                touchOption.longTouchEventInterValId = null;
            }
            if(touchOption.isDoingLongEvent){
                touchOption.isDoingLongEvent = false;
                var eventType = mo_evt.TouchEvent.LONG_TOUCH_END;
                if(self.willTrigger(eventType)){
                    var event = new mo_evt.TouchEvent(eventType);
                    self.dispatchEvent(event);
                }
            }
        }
        _emitLongTouchBegan(){
            var self = this, touchOption = self._touchOption;
            var isDoingLongEvent = touchOption.isDoingLongEvent;
            var canLongTouch = touchOption.canLongTouch;
            if(isDoingLongEvent && !canLongTouch){
                //这时候已经不能再继续长按了并且需要相应长按结束事件
                touchOption.isDoingLongEvent = false;
                var endType = mo_evt.TouchEvent.LONG_TOUCH_END;
                if(self.willTrigger(endType)){
                    var event = new mo_evt.TouchEvent(endType);
                    self.dispatchEvent(event);
                }
                return;
            }else if(!canLongTouch){//已经停止工作了
            }else{
                touchOption.isDoingLongEvent = true;
                var eventType = mo_evt.TouchEvent.LONG_TOUCH_BEGIN;
                if(self.willTrigger(eventType)){
                    var event = new mo_evt.TouchEvent(eventType);
                    self.dispatchEvent(event);
                }
            }
        }

        get hitChildrenEnabled():boolean{
            return this._touchOption.hitChildrenEnabled;
        }
        set hitChildrenEnabled(hitChildrenEnabled:boolean){
            this._touchOption.hitChildrenEnabled = hitChildrenEnabled;
        }
        public hitTest(x:number, y:number, ignoreTouchEnabled:boolean = false):egret.DisplayObject {
            var self = this, result:egret.DisplayObject = null;
            if (!self._visible) {
                return result;
            }
            var touchOption = self._touchOption, nodeOption = self._nodeOption;
            var hitChildrenEnabled = touchOption.hitChildrenEnabled;
            if(hitChildrenEnabled){
                var children = self._children, l = children.length, hitEgretEnabled = touchOption.hitEgretEnabled;
                for (var i = l - 1; i >= 0; i--) {
                    var child:Node = <Node>children[i];
                    if(!hitEgretEnabled && !child._nodeOption){
                        continue;//知道node这层
                    }
                    var mtx = child._getMatrix();
                    mtx.invert();
                    var point:egret.Point = egret.Matrix.transformCoords(mtx, x, y);
                    var childHitTestResult = child.hitTest(point.x, point.y, true);
                    if (childHitTestResult && childHitTestResult._touchEnabled) {
                        return childHitTestResult;
                    }
                }
            }

            if (!ignoreTouchEnabled && !this._touchEnabled) {
                return null;
            }
            if(!nodeOption.penetrable){
                var bound:egret.Rectangle = this._getSize(egret.Rectangle.identity);
                if (0 <= x && x < bound.width && 0 <= y && y < bound.height) {
                    result = self;
                }
            }
            return result;
        }
        _initTouchEvents(){
            var self = this, touchOption = self._touchOption;
            if(touchOption.touchEventsInited) return;//已经初始化过了就不再初始化了
            touchOption.touchEventsInited = true;
            touchOption.bePressed = false;
            var TE = egret.TouchEvent;
            self.addEventListener(TE.TOUCH_BEGIN, self._onTouchBegin, self);
        }

        __resetDownEvent() {
            var self = this, stage:egret.Stage = egret.MainContext.instance.stage;
            self._touchOption.bePressed = false;

            var TE = egret.TouchEvent;
            self.addEventListener(TE.TOUCH_BEGIN, self._onTouchBegin, self);

            stage.removeEventListener(TE.TOUCH_MOVE, self._onTouchMoveInStage, self, true);
            stage.removeEventListener(TE.TOUCH_END, self._onTouchEndInStage, self, true);

        }

        __resetOtherEvents() {
            var self = this, stage:egret.Stage = egret.MainContext.instance.stage;
            self._touchOption.bePressed = true;
            var TE = egret.TouchEvent;
            self.removeEventListener(TE.TOUCH_BEGIN, self._onTouchBegin, self);

            stage.addEventListener(TE.TOUCH_MOVE, self._onTouchMoveInStage, self, true);
            stage.addEventListener(TE.TOUCH_END, self._onTouchEndInStage, self, true);
        }

        _onTouchMoveInStage(event:egret.TouchEvent){
            var self = this, touchOption = self._touchOption;
            var touchMovingPoint = touchOption.touchMovingPoint;
            self.globalToLocal(event.localX, event.stageY, touchMovingPoint);
            touchOption.touchMovingStagePoint.x = event.stageX;
            touchOption.touchMovingStagePoint.y = event.stageY;

            var x = touchMovingPoint.x, y = touchMovingPoint.y;
            var bound:egret.Rectangle = this._getSize(egret.Rectangle.identity);
            if (0 <= x && x < bound.width && 0 <= y && y < bound.height) {//在区域内
                touchOption.isIn = true;
            }else {
                touchOption.isIn = false;
            }

            self._moving();
            var eventType = mo_evt.TouchEvent.NODE_MOVE;
            if(self.willTrigger(eventType)){
                var tempEvent = new mo_evt.TouchEvent(eventType);
                //TODO 这里需要做坐标赋值
                self.dispatchEvent(tempEvent);
            }

            touchOption.touchMovedPoint.x = touchMovingPoint.x;
            touchOption.touchMovedPoint.y = touchMovingPoint.y;
            touchOption.touchMovedStagePoint.x = event.stageX;
            touchOption.touchMovedStagePoint.y = event.stageY;
        }
        _moving(){

        }
        _onTouchEndInStage(event:egret.TouchEvent){
            var self = this, touchOption = self._touchOption;
            var touchEndedPoint = touchOption.touchEndedPoint;
            touchOption.touchEndedStagePoint.x = event.stageX;
            touchOption.touchEndedStagePoint.y = event.stageY;
            self.globalToLocal(event.localX, event.stageY, touchEndedPoint);
            self._unscheduleLongTouchCheck();

            self._end(event);
            var eventType = mo_evt.TouchEvent.NODE_END;
            if(self.willTrigger(eventType)){
                var tempEvent = new mo_evt.TouchEvent(eventType);
                //TODO 这里需要做坐标赋值
                self.dispatchEvent(tempEvent);
            }
            self.__resetDownEvent();
        }
        _end(event:egret.TouchEvent){
            var self = this, touchOption = self._touchOption;
            if(touchOption.isIn && touchOption.canTap) {

                if(self._nodeOption.clickCb != null) {
                    mo_evt.dispatchEvent([
                        [mo_evt.clickDispatcher, self.name]
                    ], self._doClick, self, event);
                }
            }
        }

        _removeTouchEvents(){
            var self = this, self2:any = self, TE = mo_evt.TouchEvent, stage:egret.Stage = egret.MainContext.instance.stage;
            mo_evt.removeEventListeners(self2, TE.TOUCH_BEGIN);
            mo_evt.removeEventListeners(self2, TE.TOUCH_MOVE);
            mo_evt.removeEventListeners(self2, TE.TOUCH_END);
            mo_evt.removeEventListeners(self2, TE.TOUCH_RELEASE_OUTSIDE);
            mo_evt.removeEventListeners(self2, TE.TOUCH_TAP);
            stage.removeEventListener(TE.TOUCH_MOVE, self._onTouchMoveInStage, self, true);
            stage.removeEventListener(TE.TOUCH_END, self._onTouchEndInStage, self, true);
            self._unscheduleLongTouchCheck();
            self._touchOption.touchEventsInited = false;
        }
        _onTouchBegin(event:egret.TouchEvent){
            var self = this, touchOption = self._touchOption;
            touchOption.bePressed = true;
            touchOption.isIn = true;
            touchOption.canTap = true;
            touchOption.clearPoints();
            self.__resetOtherEvents();

            touchOption.touchMovedPoint.x = touchOption.touchBeganPoint.x = event.localX;
            touchOption.touchMovedPoint.y = touchOption.touchBeganPoint.y = event.localY;
            touchOption.touchMovedStagePoint.x = touchOption.touchBeganStagePoint.x = event.stageX;
            touchOption.touchMovedStagePoint.y = touchOption.touchBeganStagePoint.y = event.stageY;
            self.onTouchBegan(event);
            if(touchOption.longTouchEnabled){
                self._scheduleLongTouchCheck(touchOption.respInterval , touchOption.startInterVal);
            }
            var eventType = mo_evt.TouchEvent.NODE_BEGIN;
            if(self.willTrigger(eventType)){
                var tempEvent = new mo_evt.TouchEvent(eventType);
                //TODO 这里需要做坐标赋值
                self.dispatchEvent(tempEvent);
            }
        }

        onTouchBegan(event:egret.TouchEvent){
            event.stopPropagation();
        }

        public onClick(cb:Function, ctx?:any, ...args:any[]){
            var nodeOption = this._nodeOption;
            nodeOption.clickCb = cb;
            nodeOption.clickCtx = ctx;
            nodeOption.clickData = args[0];
        }
        _doClick(event:egret.TouchEvent){
            var self = this, nodeOption = self._nodeOption;
            nodeOption.clickCb.call(nodeOption.clickCtx, self, event, nodeOption.clickData);
        }

        //=============事件设置相关 结束==========================

        //+++++++++++++++mo._baseNodePrototype 开始++++++++++++++++++++++

        doDtor(){
            var self = this;
            if(self._hasDtored) return;
            self._hasDtored = true;
            var nodeOption = self._nodeOption;
            if(nodeOption.hasDtored) return;//证明已经释放过了
            nodeOption.hasDtored = true;
            var children = self._children;
            for(var i = 0, li = children.length; i < li; ++i){
                var child:any = children[i];
                if(child && child.isAutoDtor && !child._isInstance && child.doDtor){
                    child.doDtor();
                }
            }
            self.dtor();
        }
        dtor(){
            var self = this;
            self._removeTouchEvents();
            mo_evt.removeEventListeners(self);//是否所有注册在本身的监听
            self.unregisterClass();

            var eventType = "dtor";
            if(self.willTrigger(eventType)){
                var event = new mo_evt.Event(eventType);
                self.dispatchEvent(event);
            }
            self._parent = null;//解除父节点绑定
            var factory = self._nodeOption.factory;
            if(factory){//如果是由工程创建出来的，那么就需要在工程中移除引用
                factory.releaseProduct(self);
            }
            //记得释放对象！！！
            self._nodeOption.doDtor();
            self._touchOption.doDtor();
        }

        registerClassByKey(clazz:any, key:any, listener:Function){
            var self:any = this;
            var eventStoreForClass = self._eventStoreForClass = self._eventStoreForClass || [];
            for(var i = 0, li = eventStoreForClass.length; i < li; i++){
                var info = eventStoreForClass[i];
                if(clazz == info[0] && key == info[1] && listener == info[2]) return;
            }
            eventStoreForClass.push([clazz, key, listener]);
            clazz.registerByKey(key, listener, self);
        }
        unregisterClass(){
            var self:any = this;
            var eventStoreForClass:any[] = self._eventStoreForClass;
            while(eventStoreForClass && eventStoreForClass.length > 0){
                var info = eventStoreForClass.pop();
                info[0].unregisterByKey(info[1], info[2], self);
            }
        }

        getFactory():any{
            return this._nodeOption.factory;
        }
        setFactory(factory){
            this._nodeOption.factory = factory;
        }

        getDelegate():any{
            return this._nodeOption.delegate;
        }
        setDelegate(delegate){
            this._nodeOption.delegate = delegate;
        }

        removeFromParent(...args:any[]):void{
            var self:any = this;
            var parent = self.getParent();
            if(parent) parent.removeChild(self);
        }

        //removeSelf():void{
        //    var self:any = this;
        //    if(self._hasDtored){
        //        logger.warn("【%s】【%s】已经被释放掉了！", self.__className, self._hashCode);
        //        return;
        //    }
        //    self.removeFromParent();
        //}

        addShader(shader:any){
            //todo
            logger.warn("addShader木有实现");
        }
        removeShader():void{
            //todo
            logger.warn("removeShader木有实现");
        }
        canBeReclaimed():boolean{
            return this._nodeOption.canBeReclaimed;
        }

        reset(...args:any[]):void{
            this._nodeOption.reset();
            this._touchOption.reset();
        }

        get isAutoDtor():boolean{
            return this._nodeOption.isAutoDtor;
        }
        set isAutoDtor(isAutoDtor:boolean){
            if(this._nodeOption){
                this._nodeOption.isAutoDtor = isAutoDtor;
            }
        }
        //+++++++++++++++mo._baseNodePrototype 结束++++++++++++++++++++++

    }

}