module mo_ui.consts.PageViewEventType {
    export var turning:number = 0;
}

module mo_ui.consts.PVTouchDir {
    export var touchLeft:number = 0;
    export var touchRight:number = 1;
}

module mo_ui {
    export class UIPageView extends UIPanel {
        static __className:string = "UIPageView";

        _curPageIdx:number;
        _pages;
        _touchMoveDir;
        _touchStartLocation:number;
        _touchMoveStartLocation:number;
        _touchMovePos;
        _leftChild;
        _rightChild;
        _leftBoundary:number;
        _rightBoundary:number;
        _isAutoScrolling:boolean;
        _autoScrollDistance:number;
        _autoScrollSpeed:number;
        _autoScrollDir:number;
        _childFocusCancelOffset:number;
        _pageViewEventListener;
        _pageViewEventSelector;

        _initProp() {
            super._initProp();

            var self = this;
            self._curPageIdx = 0;
            self._pages = [];
            self._touchMoveDir = consts.PVTouchDir.touchLeft;
            self._touchStartLocation = 0;
            self._touchMoveStartLocation = 0;
            self._leftBoundary = 0;
            self._rightBoundary = 0;
            self._isAutoScrolling = false;
            self._autoScrollDistance = 0;
            self._autoScrollSpeed = 0;
            self._autoScrollDir = 0;
            self._childFocusCancelOffset = 5;
            self._touchMovePos = mo.p(0,0);
        }

        _init() {
            super._init.call(this);
            this._setClippingEnabled(true);
            this.setTouchEnabled(true);
        }

        onEnter() {
            super.onEnter.call(this);
            mo.tick(this.update, this);
        }

        onExit() {
            super.onExit.call(this);
            mo.clearTick(this.update, this);
        }

        /**
         * Add a widget to a page of pageview.
         * @param {UIWidget} widget
         * @param {Number} pageIdx
         * @param {Boolean} forceCreate
         */
        addWidgetToPage(widget:UIWidget, pageIdx:number, forceCreate:boolean) {
            if (!widget) {
                return;
            }
            if (pageIdx < 0) {
                return;
            }
            var pageCount = this._pages.length;
            if (pageIdx >= pageCount) {
                if (forceCreate) {
                    if (pageIdx > pageCount) {
                        logger.log("pageIdx is %d, it will be added as page id [%d]", pageIdx, pageCount);
                    }
                    var newPage = this.createPage();
                    newPage.addChild(widget);
                    this.addPage(newPage);
                }
            }
            else {
                var page = this._pages[pageIdx];
                if (page) {
                    page.addChild(widget);
                }
            }
        }

        /**
         * create page
         * @returns {UIPanel}
         */
        createPage():UIPanel {
            var newPage:UIPanel = UIPanel.create();
            newPage.setSize(this.getSize());
            return newPage;
        }

        /**
         * Push back a page to pageview.
         * @param {UIPanel} page
         */
        addPage(page:UIPanel) {
            if (!page) {
                return;
            }
            if (mo_arr.ArrayContainsObject(this._pages, page)) {
                return;
            }
            var pSize = page.getSize();
            var pvSize = this.getSize();
            if (!(pSize.width == pvSize.width && pSize.height == pvSize.height)) {
                logger.log("page size does not match pageview size, it will be force sized!");
                page.setSize(pvSize);
            }
            page.setPosition(mo.p(this.getPositionXByIndex(this._pages.length), 0));
            this._pages.push(page);
            this.addChild(page);
            this.updateBoundaryPages();
        }

        /**
         * Inert a page to pageview.
         * @param {UIPanel} page
         * @param {Number} idx
         */
        insertPage(page:UIPanel, idx:number) {
            if (idx < 0) {
                return;
            }
            if (!page) {
                return;
            }
            if (mo_arr.ArrayContainsObject(this._pages, page)) {
                return;
            }

            var pageCount = this._pages.length;
            if (idx >= pageCount) {
                this.addPage(page);
            }
            else {
                mo_arr.ArrayAppendObjectToIndex(this._pages, page, idx);
                page.setPosition(mo.p(this.getPositionXByIndex(idx), 0));
                this.addChild(page);
                var pSize = page.getSize();
                var pvSize = this.getSize();
                if (!pSize.equals(pvSize)) {
                    logger.log("page size does not match pageview size, it will be force sized!");
                    page.setSize(pvSize);
                }
                var arrayPages = this._pages;
                var length = arrayPages.length;
                for (var i = (idx + 1); i < length; i++) {
                    var behindPage = arrayPages[i];
                    var formerPos:mo.Point = behindPage.getPosition();
                    behindPage.setPosition(mo.p(formerPos.x + this.getSize().width, 0));
                }
                this.updateBoundaryPages();
            }
        }

        /**
         * Remove a page of pageview.
         * @param {UIPanel} page
         */
        removePage(page:any) {
            if (!page) {
                return;
            }
            this.removeChild(page);
            this.updateChildrenPosition();
            this.updateBoundaryPages();
        }

        /**
         * Remove a page at index of pageview.
         * @param {Number} index
         */
        removePageAtIndex(index:number) {
            if (index < 0 || index >= this._pages.length) {
                return;
            }
            var page = this._pages[index];
            if (page) {
                this.removePage(page);
            }
        }

        updateBoundaryPages() {
            if (this._pages.length <= 0) {
                this._leftChild = null;
                this._rightChild = null;
                return;
            }
            this._leftChild = this._pages[0];
            this._rightChild = this._pages[this._pages.length - 1];
        }

        /**
         * Get x position by index
         * @param {Number} idx
         * @returns {Number}
         */
        getPositionXByIndex(idx:number) {
            return (this.getSize().width * (idx - this._curPageIdx));
        }

        /**
         *  remove widget child override
         * @param {UIWidget} child
         */
        removeChild(child:egret.DisplayObject):egret.DisplayObject {
            mo_arr.ArrayRemoveObject(this._pages, child);
            return super.removeChild.call(this, child);
        }

        _onNodeSizeDirty() {
            super._onNodeSizeDirty.call(this);
            this._rightBoundary = this.getSize().width;
            this.updateChildrenSize();
            this.updateChildrenPosition();
        }

        updateChildrenSize() {
            if (!(this._pages.length <= 0)) {
                return;
            }

            var selfSize = this.getSize();
            for (var i = 0; i < this._pages.length; i++) {
                var page = this._pages[i];
                page.setSize(selfSize);
            }
        }

        updateChildrenPosition() {
            if (!this._pages) {
                return;
            }

            var pageCount = this._pages.length;
            if (pageCount <= 0) {
                this._curPageIdx = 0;
                return;
            }
            if (this._curPageIdx >= pageCount) {
                this._curPageIdx = pageCount - 1;
            }
            var pageWidth = this.getSize().width;
            var arrayPages = this._pages;
            for (var i = 0; i < pageCount; i++) {
                var page = arrayPages[i];
                page.setPosition(mo.p((i - this._curPageIdx) * pageWidth, 0));
            }
        }

        public removeChildren() {
            this._pages.length = 0;
            super.removeChildren();
        }

        /**
         * scroll pageview to index.
         * @param {Number} idx
         */
        scrollToPage(idx:number) {
            if (idx < 0 || idx >= this._pages.length) {
                return;
            }
            if (this._isAutoScrolling) return;

            this._curPageIdx = idx;
            var curPage = this._pages[idx];
            this._autoScrollDistance = -(curPage.getPosition().x);
            this._autoScrollSpeed = Math.abs(this._autoScrollDistance) / 0.2;
            this._autoScrollDir = this._autoScrollDistance > 0 ? 1 : 0;
            this._isAutoScrolling = true;
        }

        update(dt) {
            if (this._isAutoScrolling) {
                switch (this._autoScrollDir) {
                    case 0:
                        var step = this._autoScrollSpeed * dt / 1000;
                        if (this._autoScrollDistance + step >= 0.0) {
                            step = -this._autoScrollDistance;
                            this._autoScrollDistance = 0.0;
                            this._isAutoScrolling = false;
                        }
                        else {
                            this._autoScrollDistance += step;
                        }
                        this.scrollPages(-step);
                        if (!this._isAutoScrolling) {
                            this.pageTurningEvent();
                        }
                        break;
                        break;
                    case 1:
                        var step = this._autoScrollSpeed * dt / 1000;
                        if (this._autoScrollDistance - step <= 0.0) {
                            step = this._autoScrollDistance;
                            this._autoScrollDistance = 0.0;
                            this._isAutoScrolling = false;
                        }
                        else {
                            this._autoScrollDistance -= step;
                        }
                        this.scrollPages(step);
                        if (!this._isAutoScrolling) {
                            this.pageTurningEvent();
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        onTouchBegan(event:egret.TouchEvent) {
            var beganPos = mo.p(event.localX, event.localY);
            this.handlePressLogic(beganPos);
        }

        onTouchMoved(event:egret.TouchEvent) {
            this._touchMovePos.x = event.localX;
            this._touchMovePos.y = event.localY;
            this.handleMoveLogic(this._touchMovePos);
            //todo this.moveEvent();
            if (!this.hitTest(event.localX, event.localY)) {
                this.setFocused(false);
                this.onTouchEnded(event);
            }
        }

        onTouchEnded(event:egret.TouchEvent) {
            this.handleReleaseLogic();
        }

        onTouchCancelled(event:egret.TouchEvent) {
            this.handleReleaseLogic();
        }

        movePages(offset) {
            var arrayPages = this._pages;
            var length = arrayPages.length;
            for (var i = 0; i < length; i++) {
                var child = arrayPages[i];
                var pos:mo.Point = child.getPosition();
                child.setPosition(mo.p(pos.x + offset, pos.y));
            }
        }

        scrollPages(touchOffset) {
            if (this._pages.length <= 0) {
                return false;
            }

            if (!this._leftChild || !this._rightChild) {
                return false;
            }

            var realOffset = touchOffset;

            switch (this._touchMoveDir) {
                case consts.PVTouchDir.touchLeft: // left
                    if (this._rightChild.getRightInParent() + touchOffset <= this._rightBoundary) {
                        realOffset = this._rightBoundary - this._rightChild.getRightInParent();
                        this.movePages(realOffset);
                        return false;
                    }
                    break;

                case consts.PVTouchDir.touchRight: // right
                    if (this._leftChild.getLeftInParent() + touchOffset >= this._leftBoundary) {
                        realOffset = this._leftBoundary - this._leftChild.getLeftInParent();
                        this.movePages(realOffset);
                        return false;
                    }
                    break;
                default:
                    break;
            }

            this.movePages(realOffset);
            return true;
        }

        handlePressLogic(touchPoint) {
            var nsp = this.globalToLocal(touchPoint.x, touchPoint.y);
            this._touchMoveStartLocation = nsp.x;
            this._touchStartLocation = nsp.x;
        }

        handleMoveLogic(touchPoint) {
            var nsp = this.globalToLocal(touchPoint.x, touchPoint.y);
            var offset = 0.0;
            var moveX = nsp.x;
            offset = moveX - this._touchMoveStartLocation;
            this._touchMoveStartLocation = moveX;
            if (offset < 0) {
                this._touchMoveDir = consts.PVTouchDir.touchLeft;
            }
            else if (offset > 0) {
                this._touchMoveDir = consts.PVTouchDir.touchRight;
            }
            this.scrollPages(offset);
        }

        handleReleaseLogic() {
            if (this._pages.length <= 0) {
                return;
            }
            var curPage = this._pages[this._curPageIdx];
            if (curPage) {
                var curPagePos:mo.Point = curPage.getPosition();
                var pageCount = this._pages.length;
                var curPageLocation = curPagePos.x;
                var pageWidth = this.getSize().width;
                var boundary = pageWidth / 2.0;
                if (curPageLocation <= -boundary) {
                    if (this._curPageIdx >= pageCount - 1)
                        this.scrollPages(-curPageLocation);
                    else
                        this.scrollToPage(this._curPageIdx + 1);
                }
                else if (curPageLocation >= boundary) {
                    if (this._curPageIdx <= 0)
                        this.scrollPages(-curPageLocation);
                    else
                        this.scrollToPage(this._curPageIdx - 1);
                }
                else {
                    this.scrollToPage(this._curPageIdx);
                }
            }
        }

        pageTurningEvent() {
            if (this._pageViewEventListener && this._pageViewEventSelector) {
                this._pageViewEventSelector.call(this._pageViewEventListener, this, consts.PageViewEventType.turning);
            }
        }

        /**
         * @param {Function} selector
         * @param {Object} target
         */
        addEventListenerPageView(selector, target) {
            this._pageViewEventSelector = selector;
            this._pageViewEventListener = target;
        }

        /**
         * get pages
         * @returns {Array}
         */
        getPages() {
            return this._pages;
        }

        /**
         * get cur page index
         * @returns {Number}
         */
        getCurPageIndex() {
            return this._curPageIdx;
        }
  
        copyClonedWidgetChildren(model) {
            var arrayPages = model.getPages();
            for (var i = 0; i < arrayPages.length; i++) {
                var page = arrayPages[i];
                this.addPage(page.clone());
            }
        }
    }
}