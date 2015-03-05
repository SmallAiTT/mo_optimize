module mo_opt {

    export class _GridViewOption extends Option {

        dataSourceAdapter:Function;
        dataSourceAdapterCtx:any;
        cellClass:any;
        cellSize:mo.Size;
        dataList:any[];//数据列表
        shownMap:any;//已经显示的映射
        recycleList:mo_ui.UIGridCell[];//显示了的回收列表
        cols:number;
        rowNumPerView:number;

        emptyCellEnabled:boolean;

        viewRect:mo.Rect;

        shownBeginPoint:mo.Point;//
        shownEndPoint:mo.Point;//
        hiddenBeginPoint:mo.Point;//
        hiddenEndPoint:mo.Point;//

        curCellBeginRow:number;
        curCellBeginCol:number;
        curCellEndRow:number;
        curCellEndCol:number;

        listenerIniter:Function;
        listenerIniterCtx:any;

        scrollView:mo_ui.UIScrollView;//如果有值则表示在scrollView内部

        //@override
        _initProp():void {
            super._initProp();
            var self = this;
            self.cellSize = mo.size(0, 0);
            self.shownMap = {};
            self.recycleList = [];
            self.cols = 1;
            self.rowNumPerView = 1;
            self.dataList = [];

            self.viewRect = mo.rect(0, 0, 1, 1);
            self.shownBeginPoint = mo.p(0, 0);
            self.shownEndPoint = mo.p(0, 0);
            self.hiddenBeginPoint = mo.p(0, 0);
            self.hiddenEndPoint = mo.p(0, 0);

            self.curCellBeginRow = 0;
            self.curCellBeginCol = 0;
            self.curCellEndRow = -1;
            self.curCellEndCol = -1;

        }

        //@override
        dtor() {
            super.dtor();
            var self = this;
            self.listenerIniter = null;
            self.listenerIniterCtx = null;
            self.dataList.length = 0;
            self.recycleList.length = 0;
            var map = self.shownMap;
            for (var key in map) {
                delete map[key];
            }
        }
    }
}
module mo_ui{
    export class UIGridView extends UIPanel {
        static __className:string = "UIGridView";

        _gridViewOption:mo_opt._GridViewOption;

        setCellClass(cellClass:any) {
            var self = this, gridViewOption = self._gridViewOption;
            gridViewOption.cellClass = cellClass;
            var cell = cellClass.create();
            var cellSize = gridViewOption.cellSize;
            cellSize.width = cell.width;
            cellSize.height = cell.height;
            gridViewOption.cols = Math.floor(self.width/cellSize.width);
            self.addChild(cell);
            cell._setVisible(false);
            cell.reset();
            gridViewOption.recycleList.push(cell);//进行回收
            gridViewOption.rowNumPerView = Math.ceil(gridViewOption.viewRect.height / cellSize.height);//一页最多可以显示几行;
        }

        setViewSize(size:any, height?:number){
            var self = this, gridViewOption = self._gridViewOption;
            var cellSize = gridViewOption.cellSize;
            var viewRect = gridViewOption.viewRect;
            if(arguments.length == 1){
                height = size.height;
                size = size.width;
            }
            viewRect.width = size;
            viewRect.height = height;
            var cellClass = gridViewOption.cellClass;
            if (cellClass) {
                gridViewOption.rowNumPerView = Math.ceil(height / cellSize.height);//一页最多可以显示几行;
            }
        }

        resetStates(){
            var self = this, gridViewOption = self._gridViewOption;
            var cellSize = gridViewOption.cellSize;
            var cellHeight = cellSize.height;
            var cols = gridViewOption.cols = Math.floor(self.width/cellSize.width);
            gridViewOption.rowNumPerView = Math.ceil(gridViewOption.viewRect.height/cellHeight);//一页最多可以显示几行;
            self._setHeight(cellHeight * Math.ceil(gridViewOption.dataList.length/cols));

            var shownMap = gridViewOption.shownMap;
            var recycleList = gridViewOption.recycleList;
            for (var key in shownMap) {
                var cell = shownMap[key];
                delete shownMap[key];
                if(cell){
                    cell._setVisible(false);
                    cell.reset();
                    recycleList.push(cell);
                }
            }

            gridViewOption.curCellBeginRow = 0;
            gridViewOption.curCellBeginCol = 0;
            gridViewOption.curCellEndRow = -1;
            gridViewOption.curCellEndCol = -1;

            //TODO 下面的模式今后需要重新优化
            var scrollView = gridViewOption.scrollView;
            if(scrollView){//表示在scrollView内部
                scrollView.setInnerContainerSize(self.getSize());
            }
        }

        registerListenerIniter(listenerIniter:Function, listenerIniterCtx:any){
            var gridViewOption = this._gridViewOption;
            gridViewOption.listenerIniter = listenerIniter;
            gridViewOption.listenerIniterCtx = listenerIniterCtx;
        }

        load(dataList:any[]) {
            var self = this, gridViewOption = self._gridViewOption;
            var cellClass = gridViewOption.cellClass;
            if (!cellClass) {
                return logger.warn("请先设置cellClass!");
            }
            gridViewOption.dataList = dataList;

            self.resetStates();

            self.refresh(0, 0);
        }

        reload(){
            var self = this, gridViewOption = self._gridViewOption;
            self.resetStates();
            var viewRect = gridViewOption.viewRect;
            self.refresh(viewRect.x, viewRect.y);
        }

        //@override
        _initProp() {
            super._initProp();
            this._gridViewOption = new mo_opt._GridViewOption();
        }

        addToScrollView(scrollView:UIScrollView){
            var self = this, gridViewOption = self._gridViewOption;
            self._setWidth(scrollView.width);
            self.setViewSize(scrollView.width, scrollView.height);
            gridViewOption.scrollView = scrollView;//在scrollView内部
            scrollView.addChild(self);
            self.resetStates();

            self.refresh(0, 0);

            scrollView.addEventListenerScrollView(function(scrollView:UIScrollView, type){
                var scrollOption = scrollView._scrollOption;
                var ic = scrollOption.innerContainer;
                var scrollDir = scrollOption.scrollDir;
                var vx = -ic.x, vy = -ic.y;
                if(type == 4){
                    var shownBeginPoint = gridViewOption.shownBeginPoint;
                    var shownEndPoint = gridViewOption.shownEndPoint;
                    var hiddenBeginPoint = gridViewOption.hiddenBeginPoint;
                    var hiddenEndPoint = gridViewOption.hiddenEndPoint;
                    var viewRect = gridViewOption.viewRect;
                    var vw = viewRect.width, vh = viewRect.height;
                    var scdy = scrollDir.y, scdx = scrollDir.x;
                    var flag = false;
                    if(scdy != 0 && scdx != 0){//非上下左右移动
                        if(hiddenBeginPoint.y <= vy
                            || hiddenEndPoint.y >= vy+vh
                            || shownBeginPoint.y > vy
                            || shownEndPoint.y < vy+vh
                            || hiddenBeginPoint.x <= vx
                            || hiddenEndPoint.x >= vx+vw
                            || shownBeginPoint.x > vx
                            || shownEndPoint.x < vx+vw){
                            flag = true;
                        }
                    }else if(scdy != 0){//上下移动
                        if(hiddenBeginPoint.y <= vy
                            || hiddenEndPoint.y >= vy+vh
                            || shownBeginPoint.y > vy
                            || shownEndPoint.y < vy+vh){
                            flag = true;
                        }
                    }else if(scdx != 0){//左右移动
                        if(hiddenBeginPoint.x <= vx
                            || hiddenEndPoint.x >= vx+vw
                            || shownBeginPoint.x > vx
                            || shownEndPoint.x < vx+vw){
                            flag = true;
                        }
                    }
                    if(flag) {
                        //debug(vx, vy, shownBeginPoint, shownEndPoint, hiddenBeginPoint, hiddenEndPoint);
                        self.refresh(vx, vy);
                    }
                }
            }, self);
        }

        refresh(vx, vy){
            var self = this, gridViewOption = self._gridViewOption;
            var cellSize = gridViewOption.cellSize, cellW = cellSize.width, cellH = cellSize.height;
            var viewRect = gridViewOption.viewRect;
            var vw = viewRect.width, vh = viewRect.height;

            var curCellBeginRow = gridViewOption.curCellBeginRow;
            var curCellBeginCol = gridViewOption.curCellBeginCol;
            var curCellEndRow = gridViewOption.curCellEndRow;
            var curCellEndCol = gridViewOption.curCellEndCol;

            var cellBeginRow = Math.floor(vy/cellH);
            var cellBeginCol = Math.floor(vx/cellW);
            var cellEndRow = Math.ceil((vy+vh)/cellH) - 1;
            var cellEndCol = Math.ceil((vx+vw)/cellW) - 1;

            var shownMap = gridViewOption.shownMap;
            var recycleList:UIGridCell[] = gridViewOption.recycleList;
            var cols = gridViewOption.cols;
            var dataList = gridViewOption.dataList;
            var cellClass = gridViewOption.cellClass;

            //重新刷新区域数值
            //重置视图区域
            viewRect.x = vx;
            viewRect.y = vy;
            var shownBeginPoint = gridViewOption.shownBeginPoint;
            var shownEndPoint = gridViewOption.shownEndPoint;
            var hiddenBeginPoint = gridViewOption.hiddenBeginPoint;
            var hiddenEndPoint = gridViewOption.hiddenEndPoint;

            //debug("shownBeginPoint--->", shownBeginPoint.x, shownBeginPoint.y);
            //debug("shownEndPoint--->", shownEndPoint.x, shownEndPoint.y);
            //debug("hiddenBeginPoint--->", hiddenBeginPoint.x, hiddenBeginPoint.y);
            //debug("hiddenEndPoint--->", hiddenEndPoint.x, hiddenEndPoint.y);
            shownBeginPoint.x = (cellBeginCol)*cellW;
            shownBeginPoint.y = (cellBeginRow)*cellH;
            shownEndPoint.x = (cellEndCol+1)*cellW;
            shownEndPoint.y = (cellEndRow+1)*cellH;

            hiddenBeginPoint.x = (cellBeginCol+1)*cellW;
            hiddenBeginPoint.y = (cellBeginRow+1)*cellH;
            hiddenEndPoint.x = (cellEndCol)*cellW;
            hiddenEndPoint.y = (cellEndRow)*cellH;
            //debug("--------------");
            //debug("shownBeginPoint--->", shownBeginPoint.x, shownBeginPoint.y);
            //debug("shownEndPoint--->", shownEndPoint.x, shownEndPoint.y);
            //debug("hiddenBeginPoint--->", hiddenBeginPoint.x, hiddenBeginPoint.y);
            //debug("hiddenEndPoint--->", hiddenEndPoint.x, hiddenEndPoint.y);

            //让行、列都不超出边界
            var dataLength = dataList.length;
            var maxRowNum = Math.ceil(dataLength / cols);//最多几行

            cellBeginRow = Math.max(0, Math.min(maxRowNum-1, cellBeginRow));
            cellBeginCol = Math.max(0, Math.min(cols-1, cellBeginCol));
            cellEndRow = Math.max(0, Math.min(maxRowNum-1, cellEndRow));
            cellEndCol = Math.max(0, Math.min(cols-1, cellEndCol));

            //重新赋值成current
            gridViewOption.curCellBeginRow = cellBeginRow;
            gridViewOption.curCellBeginCol = cellBeginCol;
            gridViewOption.curCellEndRow = cellEndRow;
            gridViewOption.curCellEndCol = cellEndCol;

            //进行视图的刷新
            //进行隐藏
            for(var row = curCellBeginRow, l_row = curCellEndRow; row <= l_row; row++){
                for(var col = curCellBeginCol, l_col = curCellEndCol; col <= l_col; ++col){
                    if(cellBeginRow <= row && cellBeginCol <= col && cellEndRow >= row && cellEndCol >= col){
                        //遇到了并集，不做任何处理
                        continue;
                    }
                    //进行隐藏处理
                    var key = row + "-" + col;
                    var cell:UIGridCell = shownMap[key];
                    delete shownMap[key];//移除
                    if(cell){
                        cell._setVisible(false);
                        cell.reset();
                        recycleList.push(cell);//进行回收
                    }
                }
            }

            var dataSourceAdapter = gridViewOption.dataSourceAdapter;
            var dataSourceAdapterCtx = gridViewOption.dataSourceAdapterCtx;

            //进行显示
            for(var row = cellBeginRow, l_row = cellEndRow; row <= l_row; row++){
                for(var col = cellBeginCol, l_col = cellEndCol; col <= l_col; ++col){
                    if(curCellBeginRow <= row && curCellBeginCol <= col && curCellEndRow >= row && curCellEndCol >= col){
                        //遇到了并集，不做任何处理
                        continue;
                    }
                    //进行显示处理
                    var index = row * cols + col;//TODO 取数据的逻辑，可能根据今后gridView方向不同而不同，现在只做垂直方向
                    var data = dataList[index];
                    if(data || gridViewOption.emptyCellEnabled){
                        var cell:UIGridCell = <UIGridCell>recycleList.pop();
                        if(!cell){//如果没有就创建新的
                            cell = cellClass.create();
                            self.addChild(cell);
                        }
                        var key = row + "-" + col;
                        shownMap[key] = cell;
                        cell._setVisible(true);
                        //计算位置，今后可能需要加自动均分等功能
                        cell._setX(col*cellW + cellW/2);
                        cell._setY(row*cellH + cellH/2);
                        var cellOption = cell._cellOption;
                        if(!cellOption.listenerInited){//cell的事件监听注册
                            if(gridViewOption.listenerIniter){
                                cell.registerListenerIniter(gridViewOption.listenerIniter, gridViewOption.listenerIniterCtx);
                            }
                            if(cellOption.listenerIniter) cell.initListeners();
                        }
                        cell.resetByData(data);
                        //call dataSrc
                        if(dataSourceAdapter) dataSourceAdapter.call(dataSourceAdapterCtx, cell);
                    }
                }
            }
        }
    }
}

