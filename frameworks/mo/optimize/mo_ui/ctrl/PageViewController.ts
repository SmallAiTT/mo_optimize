module mo_ui {
    export class PageViewController extends WidgetCtrl {
        static __className:string = "PageViewController";

        _pageViewContainer:UIPageView;
        _initPageCount:number;
        _itemClass:any;
        _itemJsonPath:string;


        _initProp() {
            super._initProp();
            var self = this;

            self._initPageCount = 3;
        }

        init(container) {
            var self = this;
            super.init();

            if (!container) {
                throw "请先指定container！";
            }
            else if (container instanceof UIPageView) {
                self._pageViewContainer = container;
            }
            else if (container instanceof UIPanel) {
                var viewSize = container.getSize();
                self._pageViewContainer = UIPageView.create();
                self._pageViewContainer.setSize(viewSize);
                container.addChild(self._pageViewContainer);
            }
            self._pageViewContainer.addEventListenerPageView(self._pageViewEvent, self);
        }

        setTouchEnabled(enable:boolean) {
            var self = this;
            self._pageViewContainer.setTouchEnabled(enable);
        }

        _createItemWidget() {
            var widget = uiReader.genWidget(this._itemJsonPath);
            var layout = this._pageViewContainer.createPage();
            layout.addChild(widget);
            this._addPage(layout);
            return layout;
        }

        setItemJsonPath(itemJsonPath:string) {
            this._itemJsonPath = itemJsonPath;
        }

        _resetItemByData(widget, data, index) {
            logger.warn("子类通过重写这个接口来设置项");
        }

        /**
         * 通过此接口进行视图的重置
         * @param {Object || Array} data
         */
        resetByData(data:any) {
            var dataArr;
            if (typeof data == "object") {
                dataArr = [];
                for (var key in data) {
                    var obj = data[key];
                    dataArr.push(obj);
                }
            }
            else {
                dataArr = data;
            }

            for (var i = 0; i < dataArr.length; i++) {
                var d = dataArr[i];
                var widget = this._createItemWidget();
                this._resetItemByData(widget, d, i);
            }
            this._pageViewEvent();
        }

        _addPage(page:UIPanel) {
            var self = this;
            if (self.getPagesCount() > self._initPageCount) {
                page.setVisible(false);
            }
            self._pageViewContainer.addPage(page);
        }

        prePage() {
            var self = this;
            var _pageViewContainer = self.getPageViewContainer();
            var curPageIndex = _pageViewContainer.getCurPageIndex();
            var prePageIndex = curPageIndex !== 0 ? curPageIndex - 1 : null;
            if (prePageIndex != null) {
                self.scrollToPage(prePageIndex);
            }
        }

        nextPage() {
            var self = this;
            var _pageViewContainer = self.getPageViewContainer(), pagesCount = self.getPagesCount();
            var curPageIndex = _pageViewContainer.getCurPageIndex();
            var nextPageIndex = curPageIndex !== pagesCount - 1 ? curPageIndex + 1 : null;
            if (nextPageIndex != null) {
                self.scrollToPage(nextPageIndex);
            }
        }

        /**
         * 获取pageViewContainer
         * @returns {UIPageView}
         */
        getPageViewContainer() {
            var self = this;
            return self._pageViewContainer;
        }

        getPagesCount() {
            var self = this;
            return self._pageViewContainer.getPages().length;
        }

        scrollToPage(idx:number) {
            var self = this;
            self._pageViewContainer.scrollToPage(idx);
        }

        getCurPageIndex() {
            return this._pageViewContainer.getCurPageIndex();
        }

        _pageViewEvent() {
            var self = this;
            var _pageViewContainer = self.getPageViewContainer(), pages = _pageViewContainer.getPages();
            var curPageIndex = _pageViewContainer.getCurPageIndex();

            var page;
            for (var i = 0; i < pages.length; i++) {
                page = pages[i];
                if (i < curPageIndex - 1 || i > curPageIndex + 1) {
                    page.setVisible(false);
                }
                else {
                    page.setVisible(true);
                }
            }
            self.onPageEnter();
        }

        _pageEnterEventSelector:Function;
        _pageEnterEventListener:any;
        addPageEnterEvent(pageEnterEventSelector, pageEnterEventListener) {
            this._pageEnterEventSelector = pageEnterEventSelector;
            this._pageEnterEventListener = pageEnterEventListener;
        }

        onPageEnter() {
            if (this._pageEnterEventSelector) {
                this._pageEnterEventSelector.call(this._pageEnterEventListener, this);
            }
        }

        dtor() {
            super.dtor();
            if (this._pageViewContainer) {
                this._pageViewContainer.doDtor();
                this._pageViewContainer = null;
            }
        }

    }
}
