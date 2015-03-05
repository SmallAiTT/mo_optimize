module mo_ui{
    export var scrollEnabled:boolean = true;//用于全局控制是否能滚动的开关
    export class UIScrollView extends UIPanel{
        static __className:string = "UIScrollView";

        //=================getter/setter 开始===================
        _scrollOption:mo_opt._ScrollOption;

        public get innerContainer():UIPanel{
            return this._scrollOption.innerContainer;
        }

        _setDirection(direction:number){
            this._scrollOption.direction = direction;
        }
        public set direction(direction:number){
            this._setDirection(direction);
        }
        public get direction(){
            return this._scrollOption.direction;
        }
        /**
         * @deprecated
         * @param direction
         */
        public setDirection(direction:number){
            this._setDirection(direction);
        }
        /**
         * @deprecated
         * @returns {number}
         */
        public getDirection():number{
            return this._scrollOption.direction;
        }
        _setBounceEnabled(bounceEnabled:boolean){
            this._scrollOption.bounceEnabled = bounceEnabled;
        }
        public set bounceEnabled(bounceEnabled:boolean){
            this._setBounceEnabled(bounceEnabled);
        }
        public get bounceEnabled():boolean{
            return this._scrollOption.bounceEnabled;
        }
        /**
         * @deprecated
         * @param bounceEnabled
         */
        public setBounceEnabled(bounceEnabled:boolean){
            this._setBounceEnabled(bounceEnabled);
        }
        /**
         * @param direction
         */
        public isBounceEnabled():boolean{
            return this._scrollOption.bounceEnabled;
        }
        public set longTouchWhenScrollingEnabled(longTouchWhenScrollingEnabled:boolean){
            this._scrollOption.longTouchWhenScrollingEnabled = longTouchWhenScrollingEnabled;
        }
        public get longTouchWhenScrollingEnabled():boolean{
            return this._scrollOption.longTouchWhenScrollingEnabled;
        }



        //=================getter/setter 结束===================

        //@override
        _initProp(){
            super._initProp();
            var self = this;

            var scrollOption = self._scrollOption = new mo_opt._ScrollOption();
            super.addChild(scrollOption.innerContainer);//注意，这里要用super

            self._touchOption.hitChildrenEnabled = true;//
            self._setTouchEnabled(true);
            self._setClippingEnabled(true);
            self._updateEnabled = false;

        }
        constructor(width?:number, height?:number){
            super(width, height);
            var self = this;
            var innerContainer = self._scrollOption.innerContainer;
            innerContainer._setWidth(self.width);
            innerContainer._setHeight(self.height);
            innerContainer._setTouchEnabled(false);
            self._initBoundary();
        }

        setSize(...args){
            super.setSize.apply(this, arguments);
            this._updateClipping();
        }

        dtor(){
            super.dtor();
            this._touchOption.doDtor();
            this._scrollOption.doDtor();
        }
        hitTest(x:number, y:number, ignoreTouchEnabled:boolean = false):egret.DisplayObject{
            var self = this, touchOption = self._touchOption;

            if(touchOption.bePressed){//如果被点了
                var bound:egret.Rectangle = this._getSize(egret.Rectangle.identity);
                if (0 <= x && x < bound.width && 0 <= y && y < bound.height) {
                    //这里是为了解决moveOut
                    touchOption.isIn = true;
                    return self;
                }else{
                    touchOption.isIn = false;
                }
            }else{
                //这里还要做一个viewRect的判断，如果不在这个区域内，就直接返回
                var bound:egret.Rectangle = this._getSize(egret.Rectangle.identity);
                if (0 <= x && x < bound.width && 0 <= y && y < bound.height) {
                    return super.hitTest(x, y, ignoreTouchEnabled);
                }else{
                    return null;
                }
            }
        }

        _updateEnabled:boolean;
        public setUpdateEnabled(updateEnabled:boolean){
            var self = this;
            if(self._updateEnabled == updateEnabled) return;
            self._updateEnabled = updateEnabled;
            if(updateEnabled){
                mo.tick(self.update, self);
            }else{
                mo.clearTick(self.update, self);
            }
        }
        //@override
        public onEnter(){
            super.onEnter();
            this.setUpdateEnabled(true);
        }
        //@override
        public onExit(){
            super.onExit();
            if(this._updateEnabled) {
                mo.clearTick(this.update, this);
                this._updateEnabled = false;//暂时解决scrollView重新回来时不能滚动的问题。
            }
        }

        /**
         * 初始化边界
         * @private
         */
        _initBoundary(){
            var self = this, scrollOption = self._scrollOption;
            var innerContainer = scrollOption.innerContainer, width = self.width, height = self.height;
            scrollOption.topBoundary = 0;
            scrollOption.bottomBoundary = height;
            scrollOption.leftBoundary = 0;
            scrollOption.rightBoundary = width;
            var bounceBoundaryParameterX = width / 3;
            var bounceBoundaryParameterY = height / 3;
            scrollOption.bounceLeftBoundary = bounceBoundaryParameterX;
            scrollOption.bounceRightBoundary = width - bounceBoundaryParameterX;
            scrollOption.bounceTopBoundary = bounceBoundaryParameterY;
            scrollOption.bounceBottomBoundary = height - bounceBoundaryParameterY;
            innerContainer.width = Math.max(innerContainer.width, width);
            innerContainer.height = Math.max(innerContainer.height, height);
            innerContainer.x = 0;
            innerContainer.y = 0;
        }

        //@override
        _onNodeSizeDirty(){
            super._onNodeSizeDirty();
            var self = this;
            self._initBoundary();
        }

        public setInnerContainerSize(size:mo.Size):void{
            var self = this;
            var innerContainer = self._scrollOption.innerContainer;
            var innerSizeWidth:number = self.width;
            var innerSizeHeight:number = self.height;
            var oldWidth = innerContainer.width, oldHeight = innerContainer.height;
            if (size.width < self.width) {
                logger.warn(mo_code.c_106);
            }
            else {
                innerSizeWidth = size.width;
            }
            if (size.height < self.height) {
                logger.warn(mo_code.c_106);
            }
            else {
                innerSizeHeight = size.height;
            }
            innerContainer.width = innerSizeWidth;
            innerContainer.height = innerSizeHeight;
            self._initBoundary();
//            switch (this._direction) {
//                case ScrollViewDir.vertical:
//                    var offset = oldHeight - innerContainer.height;
//                    this.scrollChildren(0, offset);
//                    break;
//                case ScrollViewDir.horizontal:
//                    if (this._innerContainer.getRightInParent() <= locSize.width) {
//                        var offset = oldWidth - innerContainer.width;
//                        this.scrollChildren(offset, 0);
//                    }
//                    break;
//                case ScrollViewDir.both:
//                    var offsetY = oldHeight - innerContainer.height;
//                    var offsetX = 0;
//                    if (innerContainer.getRightInParent() <= locSize.width) {
//                        offsetX = oldWidth - innerContainer.width;
//                    }
//                    this.scrollChildren(offsetX, offsetY);
//                    break;
//                default:
//                    break;
//            }
//            var innerSize = innerContainer.getSize();
//            var innerPos = innerContainer.getPosition();
//            var innerAP = innerContainer.getAnchorPoint();
//            if (innerContainer.getLeftInParent() > 0.0) {
//                innerContainer.setPosition(p(innerAP.x * innerSize.width, innerPos.y));
//            }
//            if (innerContainer.getRightInParent() < locSize.width) {
//                innerContainer.setPosition(p(locSize.width - ((1.0 - innerAP.x) * innerSize.width), innerPos.y));
//            }
//            if (innerPos.y > 0.0) {
//                innerContainer.setPosition(p(innerPos.x, innerAP.y * innerSize.height));
//            }
//            if (innerContainer.getTopInParent() < locSize.height) {
//                innerContainer.setPosition(p(innerPos.x, locSize.height - (1.0 - innerAP.y) * innerSize.height));
//            }
        }

        public getInnerContainer():UIPanel{
            return this._scrollOption.innerContainer;
        }

        public getInnerContainerSize():mo.Size{
            return this._scrollOption.innerContainer.getSize();
        }

        moveChildren(offsetX:number, offsetY:number):void{
            var scrollOption = this._scrollOption, ic = scrollOption.innerContainer;
            ic.x = scrollOption.moveChildPoint.x = ic.x + offsetX;
            ic.y = scrollOption.moveChildPoint.y = ic.y + offsetY;
        }
        autoScrollChildren(dt:number):void{
            var self = this, scrollOption = self._scrollOption, lastTime = scrollOption.autoScrollAddUpTime,
                asoSpeed = scrollOption.autoScrollOriginalSpeed;
            scrollOption.autoScrollAddUpTime += dt;
            if (scrollOption.isAutoScrollSpeedAttenuated) {
                var nowSpeed = asoSpeed + scrollOption.autoScrollAcceleration * scrollOption.autoScrollAddUpTime / 1000;
//                console.log("--->", asoSpeed, self._autoScrollAcceleration, self._autoScrollAddUpTime, nowSpeed);
                if (nowSpeed <= 0) {
                    self.stopAutoScrollChildren();
                    self.checkNeedBounce();
                } else {
                    var timeParam = lastTime * 2 + dt;
                    var offset = (asoSpeed + scrollOption.autoScrollAcceleration * timeParam * 0.5/1000) * dt / 1000;
                    var offsetX = offset * scrollOption.autoScrollDir.x;
                    var offsetY = offset * scrollOption.autoScrollDir.y;
//                    console.log("offset", offset, offsetX, offsetY, self._autoScrollDir.x, self._autoScrollDir.y);
                    if (!self.scrollChildren(offsetX, offsetY)) {
                        self.stopAutoScrollChildren();
                        self.checkNeedBounce();
                    }
                }
            }
            else {
                var offsetX = scrollOption.autoScrollDir.x * dt * asoSpeed/1000;
                var offsetY = scrollOption.autoScrollDir.y * dt * asoSpeed/1000;
                if (scrollOption.needCheckAutoScrollDestination) {
                    var notDone = self.checkCustomScrollDestination(offsetX, offsetY);
                    var scrollCheck = self.scrollChildren(offsetX, offsetY);
                    if (!notDone || !scrollCheck) {
                        self.stopAutoScrollChildren();
                        self.checkNeedBounce();
                    }
                }
                else {
                    if (!self.scrollChildren(offsetX, offsetY)) {
                        self.stopAutoScrollChildren();
                        self.checkNeedBounce();
                    }
                }
            }
        }

        bounceChildren(dt:number):void{
            var self = this, scrollOption = self._scrollOption,
                locSpeed = scrollOption.bounceOriginalSpeed, locBounceDir = scrollOption.bounceDir;
            if (locSpeed <= 0.0) {
                self.stopBounceChildren();
            }
            if (!self.bounceScrollChildren(locBounceDir.x * dt * locSpeed / 1000, locBounceDir.y * dt * locSpeed / 1000)) {
                self.stopBounceChildren();
            }
        }

        checkNeedBounce():boolean{
            var self = this, scrollOption = self._scrollOption;
            if (!scrollOption.bounceEnabled) {
                return false;
            }
            self.checkBounceBoundary();
            var scrollVector:mo.Point;
            var container = self._scrollOption.innerContainer;
            var tbn = scrollOption.topBounceNeeded, bbn = scrollOption.bottomBounceNeeded, lbn = scrollOption.leftBounceNeeded, rbn = scrollOption.rightBounceNeeded;
            var width = self.width, height = self.height;

            if (tbn && lbn) {
                scrollVector = mo.p(0.0, 0).sub(mo.p(container.getLeftInParent(), container.getTopInParent()));
            }
            else if (tbn && rbn) {
                scrollVector = mo.p(width, 0).sub(mo.p(container.getRightInParent(), container.getTopInParent()));
            }
            else if (bbn && lbn) {
                scrollVector = mo.p(0, height).sub(mo.p(container.getLeftInParent(), container.getBottomInParent()));
            }
            else if (bbn && rbn) {
                scrollVector = mo.p(width, height).sub(mo.p(container.getRightInParent(), container.getBottomInParent()));
            }
            else if (tbn) {
                scrollVector = mo.p(0, 0).sub(mo.p(0.0, container.getTopInParent()));
            }
            else if (bbn) {
                scrollVector = mo.p(0, height).sub(mo.p(0.0, container.getBottomInParent()));
            }
            else if (lbn) {
                scrollVector = mo.p(0, 0).sub(mo.p(container.getLeftInParent(), 0.0));
            }
            else if (rbn) {
                scrollVector = mo.p(width, 0).sub(mo.p(container.getRightInParent(), 0.0));
            }
            if(scrollVector){
                var orSpeed = scrollVector.length / 0.2;
                scrollOption.bounceDir = scrollVector.normalize();
                this.startBounceChildren(orSpeed);
                return true;
            }
            return false;
        }

        checkBounceBoundary(){//检查回弹边界
            var self = this, container = self._scrollOption.innerContainer, scrollOption = self._scrollOption;
            var icBottomPos = container.getBottomInParent();
            if (icBottomPos < scrollOption.bottomBoundary) {
                self.scrollToBottomEvent();
                scrollOption.bottomBounceNeeded = true;
            }
            else {
                scrollOption.bottomBounceNeeded = false;
            }
            var icTopPos = container.getTopInParent();
            if (icTopPos > scrollOption.topBoundary) {
                self.scrollToTopEvent();
                scrollOption.topBounceNeeded = true;
            }
            else {
                scrollOption.topBounceNeeded = false;
            }
            var icRightPos = container.getRightInParent();
            if (icRightPos < scrollOption.rightBoundary) {
                self.scrollToRightEvent();
                scrollOption.rightBounceNeeded = true;
            }
            else {
                scrollOption.rightBounceNeeded = false;
            }
            var icLeftPos = container.getLeftInParent();
            if (icLeftPos > scrollOption.leftBoundary) {
                self.scrollToLeftEvent();
                scrollOption.leftBounceNeeded = true;
            }
            else {
                scrollOption.leftBounceNeeded = false;
            }
        }

        startBounceChildren(v:number):void{//开始回弹
            var self = this, scrollOption = self._scrollOption;
            scrollOption.bounceOriginalSpeed = v;//设置回弹速度
            scrollOption.bouncing = true;//设置正在回弹状态
        }
        stopBounceChildren():void{//停止回弹
            var self = this, scrollOption = self._scrollOption;
            scrollOption.bouncing = false;//设置正在回弹状态为false
            scrollOption.bounceOriginalSpeed = 0.0;//设置回弹速度为0
            //重置边界回弹校验为false
            scrollOption.leftBounceNeeded = false;
            scrollOption.rightBounceNeeded = false;
            scrollOption.topBounceNeeded = false;
            scrollOption.bottomBounceNeeded = false;
        }

        startAutoScrollChildrenWithOriginalSpeed(dir, v, attenuated, acceleration):void{//开始自动滚动
            var self = this, scrollOption = self._scrollOption;
            self.stopAutoScrollChildren();//每次开始时先停止
            scrollOption.autoScrollDir = dir;
            scrollOption.isAutoScrollSpeedAttenuated = attenuated;
            scrollOption.autoScrollOriginalSpeed = v;
            scrollOption.autoScroll = true;
            scrollOption.autoScrollAcceleration = acceleration;
        }

        stopAutoScrollChildren():void{//停止自动滚动
            var self = this, scrollOption = self._scrollOption;
            scrollOption.autoScroll = false;
            scrollOption.autoScrollOriginalSpeed = 0;
            scrollOption.autoScrollAddUpTime = 0;
        }
        bounceScrollChildren(touchOffsetX, touchOffsetY):boolean{//回弹滚动
            var self = this, container = self._scrollOption.innerContainer, scrollOption = self._scrollOption;
            var scrollEnabled = true;
            if (touchOffsetX > 0.0 && touchOffsetY < 0.0) //first quadrant //bounce to top-right
            {
                var realOffsetX = touchOffsetX;
                var realOffsetY = touchOffsetY;
                var icRightPos = container.getRightInParent();
                if (icRightPos + realOffsetX >= scrollOption.rightBoundary) {
                    realOffsetX = scrollOption.rightBoundary - icRightPos;
                    self.bounceRightEvent();
                    scrollEnabled = false;
                }
                var icTopPos = container.getTopInParent();
                if (icTopPos + touchOffsetY <= scrollOption.topBoundary) {
                    realOffsetY = scrollOption.topBoundary - icTopPos;
                    self.bounceTopEvent();
                    scrollEnabled = false;
                }
                self.moveChildren(realOffsetX, realOffsetY);
            }
            else if (touchOffsetX < 0.0 && touchOffsetY < 0.0) //second quadrant //bounce to top-left
            {
                var realOffsetX = touchOffsetX;
                var realOffsetY = touchOffsetY;
                var icLefrPos = container.getLeftInParent();
                if (icLefrPos + realOffsetX <= scrollOption.leftBoundary) {
                    realOffsetX = scrollOption.leftBoundary - icLefrPos;
                    self.bounceLeftEvent();
                    scrollEnabled = false;
                }
                var icTopPos = container.getTopInParent();
                if (icTopPos + touchOffsetY <= scrollOption.topBoundary) {
                    realOffsetY = scrollOption.topBoundary - icTopPos;
                    self.bounceTopEvent();
                    scrollEnabled = false;
                }
                self.moveChildren(realOffsetX, realOffsetY);
            }
            else if (touchOffsetX < 0.0 && touchOffsetY > 0.0) //third quadrant //bounce to bottom-left
            {
                var realOffsetX = touchOffsetX;
                var realOffsetY = touchOffsetY;
                var icLefrPos = container.getLeftInParent();
                if (icLefrPos + realOffsetX <= scrollOption.leftBoundary) {
                    realOffsetX = scrollOption.leftBoundary - icLefrPos;
                    self.bounceLeftEvent();
                    scrollEnabled = false;
                }
                var icBottomPos = container.getBottomInParent();
                if (icBottomPos + touchOffsetY >= scrollOption.bottomBoundary) {
                    realOffsetY = scrollOption.bottomBoundary - icBottomPos;
                    self.bounceBottomEvent();
                    scrollEnabled = false;
                }
                self.moveChildren(realOffsetX, realOffsetY);
            }
            else if (touchOffsetX > 0.0 && touchOffsetY > 0.0) //forth quadrant //bounce to bottom-right
            {
                var realOffsetX = touchOffsetX;
                var realOffsetY = touchOffsetY;
                var icRightPos = container.getRightInParent();
                if (icRightPos + realOffsetX >= scrollOption.rightBoundary) {
                    realOffsetX = scrollOption.rightBoundary - icRightPos;
                    self.bounceRightEvent();
                    scrollEnabled = false;
                }
                var icBottomPos = container.getBottomInParent();
                if (icBottomPos + touchOffsetY >= scrollOption.bottomBoundary) {
                    realOffsetY = scrollOption.bottomBoundary - icBottomPos;
                    self.bounceBottomEvent();
                    scrollEnabled = false;
                }
                self.moveChildren(realOffsetX, realOffsetY);
            }
            else if (touchOffsetX == 0.0 && touchOffsetY < 0.0) // bounce to top
            {
                var realOffsetY = touchOffsetY;
                var icTopPos = container.getTopInParent();
                if (icTopPos + touchOffsetY <= scrollOption.topBoundary) {
                    realOffsetY = scrollOption.topBoundary - icTopPos;
                    self.bounceTopEvent();
                    scrollEnabled = false;
                }
                self.moveChildren(0.0, realOffsetY);
            }
            else if (touchOffsetX == 0.0 && touchOffsetY > 0.0) //bounce to bottom
            {
                var realOffsetY = touchOffsetY;
                var icBottomPos = container.getBottomInParent();
                if (icBottomPos + touchOffsetY >= scrollOption.bottomBoundary) {
                    realOffsetY = scrollOption.bottomBoundary - icBottomPos;
                    self.bounceBottomEvent();
                    scrollEnabled = false;
                }
                self.moveChildren(0.0, realOffsetY);
            }
            else if (touchOffsetX > 0.0 && touchOffsetY == 0.0) //bounce to right
            {
                var realOffsetX = touchOffsetX;
                var icRightPos = container.getRightInParent();
                if (icRightPos + realOffsetX >= scrollOption.rightBoundary) {
                    realOffsetX = scrollOption.rightBoundary - icRightPos;
                    self.bounceRightEvent();
                    scrollEnabled = false;
                }
                self.moveChildren(realOffsetX, 0.0);
            }
            else if (touchOffsetX < 0.0 && touchOffsetY == 0.0) //bounce to left
            {
                var realOffsetX = touchOffsetX;
                var icLeftPos = container.getLeftInParent();
                if (icLeftPos + realOffsetX <= scrollOption.leftBoundary) {
                    realOffsetX = scrollOption.leftBoundary - icLeftPos;
                    self.bounceLeftEvent();
                    scrollEnabled = false;
                }
                self.moveChildren(realOffsetX, 0.0);
            }
            return scrollEnabled;
        }

        checkCustomScrollDestination(touchOffsetX:number, touchOffsetY:number):boolean{
            var self = this, container = self._scrollOption.innerContainer, scrollOption = self._scrollOption,
                dir = scrollOption.autoScrollDir, dest = scrollOption.autoScrollDestination;
            var scrollEnabled = true;
            switch (scrollOption.direction) {
                case ScrollViewDir.vertical: // vertical
                    if (dir.y > 0) {
                        var icBottomPos = container.getBottomInParent();
                        if (icBottomPos + touchOffsetY >= dest.y) {
                            touchOffsetY = dest.y - icBottomPos;
                            scrollEnabled = false;
                        }
                    }
                    else {
                        var icBottomPos = container.getBottomInParent();
                        if (icBottomPos + touchOffsetY <= dest.y) {
                            touchOffsetY = dest.y - icBottomPos;
                            scrollEnabled = false;
                        }
                    }
                    break;
                case ScrollViewDir.horizontal: // horizontal
                    if (dir.x > 0) {
                        var icLeftPos = container.getLeftInParent();
                        if (icLeftPos + touchOffsetX >= dest.x) {
                            touchOffsetX = dest.x - icLeftPos;
                            scrollEnabled = false;
                        }
                    }
                    else {
                        var icLeftPos = container.getLeftInParent();
                        if (icLeftPos + touchOffsetX <= dest.x) {
                            touchOffsetX = dest.x - icLeftPos;
                            scrollEnabled = false;
                        }
                    }
                    break;
                case ScrollViewDir.both:
                    if (touchOffsetX > 0.0 && touchOffsetY > 0.0) // up right
                    {
                        var icLeftPos = container.getLeftInParent();
                        if (icLeftPos + touchOffsetX >= dest.x) {
                            touchOffsetX = dest.x - icLeftPos;
                            scrollEnabled = false;
                        }
                        var icBottomPos = container.getBottomInParent();
                        if (icBottomPos + touchOffsetY >= dest.y) {
                            touchOffsetY = dest.y - icBottomPos;
                            scrollEnabled = false;
                        }
                    }
                    else if (touchOffsetX < 0.0 && touchOffsetY > 0.0) // up left
                    {
                        var icRightPos = container.getRightInParent();
                        if (icRightPos + touchOffsetX <= dest.x) {
                            touchOffsetX = dest.x - icRightPos;
                            scrollEnabled = false;
                        }
                        var icBottomPos = container.getBottomInParent();
                        if (icBottomPos + touchOffsetY >= dest.y) {
                            touchOffsetY = dest.y - icBottomPos;
                            scrollEnabled = false;
                        }
                    }
                    else if (touchOffsetX < 0.0 && touchOffsetY < 0.0) // down left
                    {
                        var icRightPos = container.getRightInParent();
                        if (icRightPos + touchOffsetX <= dest.x) {
                            touchOffsetX = dest.x - icRightPos;
                            scrollEnabled = false;
                        }
                        var icTopPos = container.getTopInParent();
                        if (icTopPos + touchOffsetY <= dest.y) {
                            touchOffsetY = dest.y - icTopPos;
                            scrollEnabled = false;
                        }
                    }
                    else if (touchOffsetX > 0.0 && touchOffsetY < 0.0) // down right
                    {
                        var icLeftPos = container.getLeftInParent();
                        if (icLeftPos + touchOffsetX >= dest.x) {
                            touchOffsetX = dest.x - icLeftPos;
                            scrollEnabled = false;
                        }
                        var icTopPos = container.getTopInParent();
                        if (icTopPos + touchOffsetY <= dest.y) {
                            touchOffsetY = dest.y - icTopPos;
                            scrollEnabled = false;
                        }
                    }
                    else if (touchOffsetX == 0.0 && touchOffsetY > 0.0) // up
                    {
                        var icBottomPos = container.getBottomInParent();
                        if (icBottomPos + touchOffsetY >= dest.y) {
                            touchOffsetY = dest.y - icBottomPos;
                            scrollEnabled = false;
                        }
                    }
                    else if (touchOffsetX < 0.0 && touchOffsetY == 0.0) // left
                    {
                        var icRightPos = container.getRightInParent();
                        if (icRightPos + touchOffsetX <= dest.x) {
                            touchOffsetX = dest.x - icRightPos;
                            scrollEnabled = false;
                        }
                    }
                    else if (touchOffsetX == 0.0 && touchOffsetY < 0.0) // down
                    {
                        var icTopPos = container.getTopInParent();
                        if (icTopPos + touchOffsetY <= dest.y) {
                            touchOffsetY = dest.y - icTopPos;
                            scrollEnabled = false;
                        }
                    }
                    else if (touchOffsetX > 0.0 && touchOffsetY == 0.0) // right
                    {
                        var icLeftPos = container.getLeftInParent();
                        if (icLeftPos + touchOffsetX >= dest.x) {
                            touchOffsetX = dest.x - icLeftPos;
                            scrollEnabled = false;
                        }
                    }
                    break;
                default:
                    break;
            }
            return scrollEnabled;
        }

        getCurAutoScrollDistance(dt:number){
            var scrollOption = this._scrollOption;
            scrollOption.autoScrollOriginalSpeed -= scrollOption.autoScrollAcceleration * dt;
            return scrollOption.autoScrollOriginalSpeed * dt;
        }

        scrollChildren(touchOffsetX:number, touchOffsetY:number):boolean{
            var self = this, scrollOption = self._scrollOption,
                direction = scrollOption.direction, container = self._scrollOption.innerContainer, offX = 0, offY = 0;
            var topBoundary = 0, bottomBoundary = 0, leftBoundary = 0, rightBoundary = 0;
            var scrollEnabled = true;

            if(direction == ScrollViewDir.horizontal) offX = touchOffsetX;
            else if(direction == ScrollViewDir.vertical) offY = touchOffsetY;
            else if(direction == ScrollViewDir.both){
                offX = touchOffsetX;
                offY = touchOffsetY;
            }
            if (scrollOption.bounceEnabled) {//是否可以回弹
                topBoundary = scrollOption.bounceTopBoundary;
                bottomBoundary = scrollOption.bounceBottomBoundary;
                leftBoundary = scrollOption.bounceLeftBoundary;
                rightBoundary = scrollOption.bounceLeftBoundary;
            }
            else {
                topBoundary = scrollOption.topBoundary;
                bottomBoundary = scrollOption.bottomBoundary;
                leftBoundary = scrollOption.leftBoundary;
                rightBoundary = scrollOption.rightBoundary;
            }
            if(offX){
                var icLeftPos = container.getLeftInParent();
                var icRightPos = container.getRightInParent();
//                console.debug("x--->", offX, icLeftPos, icRightPos, leftBoundary, rightBoundary);
                if (icLeftPos + touchOffsetX >= leftBoundary) {
                    offX = leftBoundary - icLeftPos;
                    this.scrollToLeftEvent();
                    scrollEnabled = false;
                }
                if (icRightPos + touchOffsetX <= rightBoundary) {
                    offX = rightBoundary - icRightPos;
                    this.scrollToRightEvent();
                    scrollEnabled = false;
                }
            }
            if(offY){
                var icTopPos = container.getTopInParent();//顶部规则同下
                var icBottomPos = container.getBottomInParent();//获取到底部坐标
//                console.debug("y--->", offY, icTopPos, icBottomPos, topBoundary, bottomBoundary);
                if (icTopPos + touchOffsetY >= topBoundary) {
                    offY = topBoundary - icTopPos;
                    this.scrollToTopEvent();
                    scrollEnabled = false;
                }
                if (icBottomPos + touchOffsetY <= bottomBoundary) {//如果说加上偏移之后超出了回弹边界
                    offY = bottomBoundary - icBottomPos;//此时设置实际偏移为回弹边界-底部坐标
                    this.scrollToBottomEvent();
                    scrollEnabled = false;//设置不可滚动
                }
            }
//            console.log("offX->", offX, "offY->", offY);
            container.x += offX;
            container.y += offY;
            var scrollDir = scrollOption.scrollDir;
            scrollDir.x = offX;
            scrollDir.y = offY;
            self.scrollingEvent();
            return scrollEnabled;
        }

        startRecordSlidAction():void{
            var self = this, scrollOption = self._scrollOption;
            if(!mo_ui.scrollEnabled || !scrollOption.scrollEnabled) return;
            if (scrollOption.autoScroll) {
                self.stopAutoScrollChildren();
            }
            if (scrollOption.bouncing) {
                self.stopBounceChildren();
            }
            scrollOption.slidTime = 0;
        }

        endRecordSlidAction():void{
            var scrollOption = this._scrollOption, touchOption = this._touchOption;
            if(!mo_ui.scrollEnabled || !scrollOption.scrollEnabled) return;
            if (!this.checkNeedBounce() && scrollOption.inertiaScrollEnabled) {
                if (scrollOption.slidTime <= 17) {
                    return;
                }
                var totalDis:number = 0;
                var dir:mo.Point;
                switch (scrollOption.direction) {
                    case ScrollViewDir.vertical :
                        totalDis = touchOption.touchEndedPoint.y - touchOption.touchBeganPoint.y;
                        if (totalDis < 0) {
                            dir = SCROLLDIR_DOWN;
                        }
                        else {
                            dir = SCROLLDIR_UP;
                        }
                        break;
                    case ScrollViewDir.horizontal:
                        totalDis = touchOption.touchEndedPoint.x - touchOption.touchBeganPoint.x;
                        if (totalDis < 0) {
                            dir = SCROLLDIR_LEFT;
                        }
                        else {
                            dir = SCROLLDIR_RIGHT;
                        }
                        break;
                    case ScrollViewDir.both :
                        var subVector = touchOption.touchEndedPoint.sub(touchOption.touchBeganPoint);
                        totalDis = subVector.length;
                        dir = subVector.normalize();
                        break;
                    default:
                        break;
                }
                var orSpeed = Math.min(Math.abs(totalDis*1000) / (scrollOption.slidTime), AUTOSCROLLMAXSPEED);//像素每秒
                this.startAutoScrollChildrenWithOriginalSpeed(dir, orSpeed, true, -1000);
                scrollOption.slidTime = 0;
            }
        }

        handlePressLogic(event:egret.TouchEvent):void{
            this.startRecordSlidAction();
        }

        handleMoveLogic():void{
            var self = this, touchOption = self._touchOption, scrollOption = self._scrollOption;
            var deltaX = touchOption.touchMovingPoint.x - touchOption.touchMovedPoint.x;
            var deltaY = touchOption.touchMovingPoint.y - touchOption.touchMovedPoint.y;
            var deltaSQ = deltaX*deltaX + deltaY*deltaY;
            touchOption.movedDeltaSQ = Math.max(touchOption.movedDeltaSQ, deltaSQ);
            if(!mo_ui.scrollEnabled || !scrollOption.scrollEnabled) return;
            this.scrollChildren(deltaX, deltaY);
        }

        _initTouchEvents(){
            var self = this, touchOption = self._touchOption;
            if(touchOption.touchEventsInited) return;//已经初始化过了就不再初始化了
            touchOption.touchEventsInited = true;
            touchOption.bePressed = false;
            var TE = egret.TouchEvent;
            self.addEventListener(TE.TOUCH_BEGIN, self._onTouchBegin, self, true);
        }

        __resetDownEvent() {
            var self = this, stage:egret.Stage = egret.MainContext.instance.stage;

            var TE = egret.TouchEvent;
            self._touchOption.bePressed = false;
            self.addEventListener(TE.TOUCH_BEGIN, self._onTouchBegin, self, true);

            stage.removeEventListener(TE.TOUCH_MOVE, self._onTouchMoveInStage, self, true);
            stage.removeEventListener(TE.TOUCH_END, self._onTouchEndInStage, self, true);

        }

        __resetOtherEvents() {
            var self = this, stage:egret.Stage = egret.MainContext.instance.stage;
            self._touchOption.bePressed = true;
            var TE = egret.TouchEvent;
            self.removeEventListener(TE.TOUCH_BEGIN, self._onTouchBegin, self, true);

            stage.addEventListener(TE.TOUCH_MOVE, self._onTouchMoveInStage, self, true);
            stage.addEventListener(TE.TOUCH_END, self._onTouchEndInStage, self, true);
        }


        //@override
        onTouchBegan(event:egret.TouchEvent){//这里不进行事件拦截，继续传递
            this._scrollOption.targetNode = <mo.Node>event.target;
            this.handlePressLogic(event);
        }

        //@override
        _moving(){
            var self = this, touchOption = self._touchOption, scrollOption = self._scrollOption;
            self.handleMoveLogic();
            if(touchOption.movedDeltaSQ > scrollOption.maxMovedDeltaSQ){
                var targetNode = scrollOption.targetNode;
                if(!scrollOption.longTouchWhenScrollingEnabled && targetNode){
                    if(targetNode._touchOption){
                        targetNode._touchOption.canLongTouch = false;
                    }
                }
            }
        }

        _end(event:egret.TouchEvent){
            var self = this, touchOption = self._touchOption,
                scrollOption = self._scrollOption, targetNode = scrollOption.targetNode;
            if(touchOption.movedDeltaSQ > scrollOption.maxMovedDeltaSQ && targetNode){
                if(targetNode._touchOption){
                    targetNode._touchOption.canTap = false;
                }
            }
            self.endRecordSlidAction();
            touchOption.movedDeltaSQ = 0;
        }

        get scrollEnabled():boolean{
            return this._scrollOption.scrollEnabled;
        }
        set scrollEnabled(scrollEnabled:boolean){
            this._scrollOption.scrollEnabled = scrollEnabled;
        }

        update(frameTime:number):void{
            var self = this, scrollOption = self._scrollOption, touchOption = self._touchOption;
            if(!scrollOption.scrollEnabled) return;
            if (scrollOption.autoScroll) {
                self.autoScrollChildren(frameTime);
            }
            if (scrollOption.bouncing) {
                self.bounceChildren(frameTime);
            }
            if (touchOption.bePressed) {
                scrollOption.slidTime += frameTime;
            }
        }

        scrollToTopEvent():void{
            var self = this, scrollOption = self._scrollOption;
            if (scrollOption.scrollViewEventListener && scrollOption.scrollViewEventSelector) {
                scrollOption.scrollViewEventSelector.call(scrollOption.scrollViewEventListener, self, ScrollViewEventType.scrollToTop);
            }
        }

        scrollToBottomEvent():void{
            var self = this, scrollOption = self._scrollOption;
            if (scrollOption.scrollViewEventListener && scrollOption.scrollViewEventSelector) {
                scrollOption.scrollViewEventSelector.call(scrollOption.scrollViewEventListener, self, ScrollViewEventType.scrollToBottom);
            }
        }

        scrollToLeftEvent():void{
            var self = this, scrollOption = self._scrollOption;
            if (scrollOption.scrollViewEventListener && scrollOption.scrollViewEventSelector) {
                scrollOption.scrollViewEventSelector.call(scrollOption.scrollViewEventListener, self, ScrollViewEventType.scrollToLeft);
            }
        }

        scrollToRightEvent():void{
            var self = this, scrollOption = self._scrollOption;
            if (scrollOption.scrollViewEventListener && scrollOption.scrollViewEventSelector) {
                scrollOption.scrollViewEventSelector.call(scrollOption.scrollViewEventListener, self, ScrollViewEventType.scrollToRight);
            }
        }

        scrollingEvent():void{
            var self = this, scrollOption = self._scrollOption;
            if (scrollOption.scrollViewEventListener && scrollOption.scrollViewEventSelector) {
                scrollOption.scrollViewEventSelector.call(scrollOption.scrollViewEventListener, self, ScrollViewEventType.scrolling);
            }
        }

        bounceTopEvent():void{
            var self = this, scrollOption = self._scrollOption;
            if (scrollOption.scrollViewEventListener && scrollOption.scrollViewEventSelector) {
                scrollOption.scrollViewEventSelector.call(scrollOption.scrollViewEventListener, self, ScrollViewEventType.bounceTop);
            }
        }

        bounceBottomEvent():void{
            var self = this, scrollOption = self._scrollOption;
            if (scrollOption.scrollViewEventListener && scrollOption.scrollViewEventSelector) {
                scrollOption.scrollViewEventSelector.call(scrollOption.scrollViewEventListener, self, ScrollViewEventType.bounceBottom);
            }
        }

        bounceLeftEvent():void{
            var self = this, scrollOption = self._scrollOption;
            if (scrollOption.scrollViewEventListener && scrollOption.scrollViewEventSelector) {
                scrollOption.scrollViewEventSelector.call(scrollOption.scrollViewEventListener, self, ScrollViewEventType.bounceLeft);
            }
        }

        bounceRightEvent():void{
            var self = this, scrollOption = self._scrollOption;
            if (scrollOption.scrollViewEventListener && scrollOption.scrollViewEventSelector) {
                scrollOption.scrollViewEventSelector.call(scrollOption.scrollViewEventListener, self, ScrollViewEventType.bounceRight);
            }
        }

        public addEventListenerScrollView(selector:Function, target:any):void{
            var scrollOption = this._scrollOption;
            scrollOption.scrollViewEventSelector = selector;
            scrollOption.scrollViewEventListener = target;
        }

        public setInertiaScrollEnabled(enabled){
            this._scrollOption.inertiaScrollEnabled = enabled;
        }
        public isInertiaScrollEnabled():boolean{
            return this._scrollOption.inertiaScrollEnabled;
        }

        //滚动的api

        startAutoScrollChildrenWithDestination(des:mo.Point, time, attenuated):void{
            var self = this, scrollOption = self._scrollOption;
            scrollOption.needCheckAutoScrollDestination = false;
            scrollOption.autoScrollDestination = des;
            var dis:mo.Point = des.sub(self._scrollOption.innerContainer.getPosition());
            var dir:mo.Point = dis.normalize();
            var orSpeed = 0.0;
            var acceleration = -1000.0;
            var disLength = dis.length;
            if (attenuated) {
                acceleration = -(2 * disLength) / (time * time);
                orSpeed = 2 * disLength / time;
            }
            else {
                scrollOption.needCheckAutoScrollDestination = true;
                orSpeed = disLength / time;
            }
            this.startAutoScrollChildrenWithOriginalSpeed(dir, orSpeed, attenuated, acceleration);
        }

        public jumpToDestination(des):void{
            var self = this, scrollOption = self._scrollOption, container = scrollOption.innerContainer;
            var finalOffsetX = des.x;
            var finalOffsetY = des.y;
            switch (scrollOption.direction) {
                case ScrollViewDir.vertical:
                    if (des.y <= 0) {
                        finalOffsetY = Math.max(des.y, self.height - container.height);
                    }
                    break;
                case ScrollViewDir.horizontal:
                    if (des.x <= 0) {
                        finalOffsetX = Math.max(des.x, self.width - container.width);
                    }
                    break;
                case ScrollViewDir.both:
                    if (des.y <= 0) {
                        finalOffsetY = Math.max(des.y, self.height - container.height);
                    }
                    if (des.x <= 0) {
                        finalOffsetX = Math.max(des.x, self.width - container.width);
                    }
                    break;
                default:
                    break;
            }
            container._setX(finalOffsetX);
            container._setY(finalOffsetY);
            self.scrollingEvent();
        }

        public scrollToBottom(time:number, attenuated:boolean):void{
            var self = this, container = self._scrollOption.innerContainer;
            self.startAutoScrollChildrenWithDestination(mo.p(container.x, self.height - container.height), time, attenuated);
        }

        public scrollToTop(time:number, attenuated:boolean):void{
            var self = this, container = self._scrollOption.innerContainer;
            self.startAutoScrollChildrenWithDestination(mo.p(container.x, 0), time, attenuated);
        }

        public scrollToLeft(time:number, attenuated:boolean):void{
            var self = this, container = self._scrollOption.innerContainer;
            self.startAutoScrollChildrenWithDestination(mo.p(0, container.y), time, attenuated);
        }

        public scrollToRight(time:number, attenuated:boolean):void{
            var self = this, container = self._scrollOption.innerContainer;
            self.startAutoScrollChildrenWithDestination(mo.p(self.width - container.width, container.y), time, attenuated);
        }

        public scrollToTopLeft(time:number, attenuated:boolean):void{
            if (this._scrollOption.direction != ScrollViewDir.both) {
                logger.debug("Scroll diretion is not both!");
                return;
            }
            this.startAutoScrollChildrenWithDestination(mo.p(0, 0), time, attenuated);
        }

        public scrollToTopRight(time:number, attenuated:boolean):void{
            var self = this, container = self._scrollOption.innerContainer;
            if (self._scrollOption.direction != ScrollViewDir.both) {
                logger.debug("Scroll diretion is not both!");
                return;
            }
            self.startAutoScrollChildrenWithDestination(mo.p(self.width - container.width, 0), time, attenuated);
        }

        public scrollToBottomLeft(time:number, attenuated:boolean):void{
            var self = this, container = self._scrollOption.innerContainer;
            if (self._scrollOption.direction != ScrollViewDir.both) {
                logger.debug("Scroll diretion is not both!");
                return;
            }
            self.startAutoScrollChildrenWithDestination(mo.p(0, self.height - container.height), time, attenuated);
        }

        public scrollToBottomRight(time:number, attenuated:boolean):void{
            var self = this, container = self._scrollOption.innerContainer;
            if (self._scrollOption.direction != ScrollViewDir.both) {
                logger.debug("Scroll diretion is not both!");
                return;
            }
            self.startAutoScrollChildrenWithDestination(mo.p(self.width - container.width, self.height - container.height), time, attenuated);
        }

        public scrollToPercentVertical(percent:number, time:number, attenuated:boolean):void{
            var self = this, container = self._scrollOption.innerContainer;
            var minY = self.height - container.height;
            self.startAutoScrollChildrenWithDestination(mo.p(container.x, percent * minY / 100), time, attenuated);
        }

        public scrollToPercentHorizontal(percent:number, time:number, attenuated:boolean):void{
            var self = this, container = self._scrollOption.innerContainer;
            var w = container.width - self.width;
            self.startAutoScrollChildrenWithDestination(mo.p(-(percent * w / 100), container.y), time, attenuated);
        }

        public scrollToPercentBothDirection(percent:mo.Point, time:number, attenuated:boolean):void{
            var self = this, container = self._scrollOption.innerContainer;
            if (self._scrollOption.direction != ScrollViewDir.both) {
                return;
            }
            var minY = self.height - container.height;
            var h = -minY;
            var w = container.width - self.width;
            self.startAutoScrollChildrenWithDestination(mo.p(-(percent.x * w / 100), minY + percent.y * h / 100), time, attenuated);
        }

        public jumpToBottom():void{
            var self = this, container = self._scrollOption.innerContainer;
            self.jumpToDestination(mo.p(container.x, self.height - container.height));
        }

        public jumpToTop():void{
            var self = this, container = self._scrollOption.innerContainer;
            this.jumpToDestination(mo.p(container.x, 0));
        }

        public jumpToLeft():void{
            var self = this, container = self._scrollOption.innerContainer;
            self.jumpToDestination(mo.p(0, container.y));
        }

        public jumpToRight():void{
            var self = this, container = self._scrollOption.innerContainer;
            self.jumpToDestination(mo.p(self.width - container.width, container.y));
        }

        public jumpToTopLeft():void{
            if (this._scrollOption.direction != ScrollViewDir.both) {
                logger.debug("Scroll diretion is not both!");
                return;
            }
            this.jumpToDestination(mo.p(0, 0));
        }

        public jumpToTopRight():void{
            var self = this, container = self._scrollOption.innerContainer;
            if (self._scrollOption.direction != ScrollViewDir.both) {
                logger.debug("Scroll diretion is not both!");
                return;
            }
            self.jumpToDestination(mo.p(self.width - container.width, 0));
        }

        public jumpToBottomLeft():void{
            var self = this, container = self._scrollOption.innerContainer;
            if (self._scrollOption.direction != ScrollViewDir.both) {
                logger.debug("Scroll diretion is not both!");
                return;
            }
            self.jumpToDestination(mo.p(0, self.height - container.height));
        }

        public jumpToBottomRight():void{
            var self = this, container = self._scrollOption.innerContainer;
            if (self._scrollOption.direction != ScrollViewDir.both) {
                logger.debug("Scroll diretion is not both!");
                return;
            }
            self.jumpToDestination(mo.p(self.width - container.width, self.height - container.height));
        }

        public jumpToPercentVertical(percent:number):void{
            var self = this, container = self._scrollOption.innerContainer;
            var minY = self.height - container.height;
            self.jumpToDestination(mo.p(container.x, percent * minY / 100));
        }
        public jumpToPercentHorizontal(percent:number):void{
            var self = this, container = self._scrollOption.innerContainer;
            var w = container.width - self.width;
            self.jumpToDestination(mo.p(-(percent * w / 100), container.y));
        }
        public jumpToPercentBothDirection(percent:mo.Point):void{
            var self = this, container = self._scrollOption.innerContainer;
            if (self._scrollOption.direction != ScrollViewDir.both) {
                return;
            }
            var minY = self.height - container.height;
            var h = -minY;
            var w = container.width - self.width;
            self.jumpToDestination(mo.p(-(percent.x * w / 100), minY + percent.y * h / 100));
        }

        //=================重写接口，用于挂接到innerContainer的相关api 开始========
        //@override
        public _setLayoutType(type:number){
            this._scrollOption.innerContainer.layoutType = type;
        }
        //@override
        public set layoutType(type:number){
            this._setLayoutType(type);
        }
        //@override
        public get layoutType():number{
            return this._scrollOption.innerContainer.layoutType;
        }
        //@override
        public addChild(child:egret.DisplayObject){
            return this._scrollOption.innerContainer.addChild(child);
        }
        //@override
        public removeChildren(){
            this._scrollOption.innerContainer.removeChildren();
        }
        //@override
        public removeChild(child:egret.DisplayObject){
            return this._scrollOption.innerContainer.removeChild(child);
        }
        //@override
        public getChildren():egret.DisplayObject[]{
            return this._scrollOption.innerContainer.getChildren();
        }
        //@override
        public getChildrenCount():number{
            return this._scrollOption.innerContainer.getChildrenCount();
        }
        //@override
        public getChildByName(name:string):egret.DisplayObject{
            return this._scrollOption.innerContainer.getChildByName(name);
        }
        //@override
        public removeWidgets(){
            this._scrollOption.innerContainer.removeWidgets();
        }
        //@override
        public removeNodes(){
            this._scrollOption.innerContainer.removeNodes();
        }
        //=================重写接口，用于挂接到innerContainer的相关api 结束========

    }//end of class
}