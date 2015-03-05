module mo_ui {
    export class GridScrollView extends UIScrollView {
        static __className:string = "GridScrollView";

        _gridView:GridView;
        _cellSize:mo.Size;
        _viewSize:mo.Size;
        _cols:number;
        _totalCount:number;

        _customEventSelector:Function;
        _customEventListener:any;

        //@override
        _initProp() {
            var self = this;
            super._initProp();

            self._cols = 0;
            self._totalCount = 0;
        }

        init(viewSize:mo.Size, cellSize:mo.Size, cols:number, totalCount:number, selector:Function, target:any, cellClass:any) {
            super.init.apply(this, arguments);
            this.setTouchEnabled(true);
            this.setDirection(ScrollViewDir.vertical);
            this.setBounceEnabled(true);

            this._viewSize = viewSize;
            this._cellSize = cellSize;
            this._totalCount = totalCount;
            this._cols = cols;

            this._gridView = GridView.create(cellSize, cols, totalCount, selector, target, cellClass);
            this._gridView.setDelegate(this);
            this.addChild(this._gridView);

            this.reSize(this._viewSize);
            this.addEventListenerScrollView(this._onScrolling, this);
        }

        reSize(size){
            this._viewSize = size;
            this.setSize(this._viewSize);
            this._resetSize();
        }

        dtor() {
            super.dtor();

            this._gridView.doDtor();
        }

        onScroll(selector:Function, target:any) {
            this._customEventSelector = selector;
            this._customEventListener = target;
        }

        _resetSize() {
            var rows = Math.ceil(this._totalCount / this._cols);
            var viewSize = this._viewSize;
            var cellSize = this._cellSize;
            var newWidth = cellSize.width * this._cols, newHeight = cellSize.height * rows;

            var newInnerWidth = newWidth < viewSize.width ? viewSize.width : newWidth;
            var newInnerHeight = newHeight < viewSize.height ? viewSize.height : newHeight;

            this.setInnerContainerSize(mo.size(newInnerWidth, newInnerHeight));
            this._gridView.setMinSize(mo.size(newInnerWidth, newInnerHeight));
        }

        /**
         *  更新内部gridview
         */
        refresh() {
            this._gridView.needUpdateCells();
        }

        /**
         * 刷新gridview可以见cell的数据
         */
        refreshData(){
            this._gridView.updateCellUsedData();
        }

        _onScrolling(sender, event) {
            this._gridView.needUpdateCells();

            if (this._customEventListener && this._customEventSelector) {
                this._customEventSelector.call(this._customEventListener, sender, event);
            }
        }

        setScrollViewTouchEnabled(isTouch:boolean) {
            this.setTouchEnabled(isTouch);
            this._gridView.setTouchEnabled(isTouch);
        }

        ignoreNullCell(ignore:boolean) {
            this._gridView.ignoreNullCell(ignore);
        }

        setTotalCount(totalCount:number) {
            this.removeAllFromUsed();//进行回收操作
            this._totalCount = totalCount;
            this._gridView.setTotalCount(totalCount);

            this._resetSize();
        }

        getTotalCount() {
            return this._totalCount;
        }

        removeAllFromUsed() {
            this._gridView.removeAllFromUsed();
        }

        //移除一个cell并刷新数据
        dropOneCell(){
            this._gridView.dropOneCell();
        }

        /**
         * 通过index获取一个cell
         * @param {Number} idx
         * @returns {*}
         */
        cellAtIndex(idx:number) {
            return this._gridView.cellAtIndex(idx);
        }

        getCells(){
            return this._gridView.getCells();
        }

        scrollToItem(idx){
            var self = this;
            var cols = self._cols;

            var visualRowCount = 0 | (self._viewSize.height / self._cellSize.height);
            var totalRow = Math.ceil(self._totalCount / cols);
            var row = Math.ceil(idx / cols);
            if (row >= visualRowCount) {
                self.jumpToPercentVertical((row - (visualRowCount - 1)) / (totalRow - visualRowCount) * 100);
            } else {
                self.jumpToPercentVertical(0);
            }
            self.refresh();
        }
    }
}