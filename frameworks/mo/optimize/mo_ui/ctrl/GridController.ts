module mo_ui {
    export class GridController extends WidgetCtrl {
        static __className:string = "GridController";

        static LAYOUT_AVG : number = 1;
        static LAYOUT_TOP : number = 2; // 顶端布局：位置从上往下画
        static LAYOUT_BOTTOM :  number =3;

        _itemJsonPath:string;
        _itemWidgets : any;
        _containerH : number;
        _containerW : number;
        _itemH : number;
        _itemW : number;
        _cols : number;
        _layout : number;//默认为均分
        _dataList : any[];
        _resizeContainer: boolean; //是否重置容器大小
        _marginH: number;

        _rows:number;

        //@override
        _initProp() {
            super._initProp();
            var self = this;
            self._containerH = 0;
            self._containerW = 0;
            self._cols = 1;
            self._layout = 1;//默认为均分
        }

        //@override
        init(container, cols, resizeContainer){
            var self = this;
            super.init.apply(self, arguments);
            self._itemWidgets = [];
            if(!container){
                throw "请先指定container！";
            }
            self.widget = container;
            (<any>self.widget).controller = self;//TODO
            self._cols = cols || self._cols;
            self._resizeContainer = resizeContainer || false;
            self._containerH = container.getSize().height;
            self._containerW = container.getSize().width;
            self._dataList = [];
        }


        _resetItemByData(widget, data, index){
            logger.warn("子类通过重写这个接口来设置项");
        }
        _initItemWidget(widget){
            //子类通过重写这个接口来设置项的监听
        }
    
        _setPosByAvg(widget, row, col){
            var self = this;
            var cH = self._containerH, iH = self._itemH;
            var marginH = (cH - iH * self._rows)/(self._rows + 1);
            widget.x = self._containerW * (col-1)/self._cols;
            widget.y = marginH + (row - 1) * (marginH + iH);
        }
        _setPosByTop_bak(widget, row, col){
            var self = this;
            var cH = self._containerH, iH = self._itemH;
            var marginH = self._marginH != null ? self._marginH : (cH - iH * self._rows)/ self._rows;
            marginH  = marginH < 0? 0 : marginH;
            widget.setPosition(self._containerW * (col-1)/self._cols, cH - iH * row - marginH * (row -1)/* marginH + (self._rows - row) * iH*/);
        }
        _setPosByTop(widget, row, col){
            var self = this;
            var cH = self._containerH, iH = self._itemH;
            var marginH = self._marginH != null ? self._marginH : (cH - iH * self._rows)/ self._rows;
            marginH = marginH < 0 ? 0 : marginH;
            // 设置x坐标：widget横向居中显示
            widget.x = widget.anchorX * widget.width + self._containerW * (col - 1) / self._cols + (self._itemW - widget.width)/2;
            widget.y = widget.anchorY * widget.height + marginH + (row - 1) * (marginH + iH);
        }
        _setPosByBottom_bak(widget, row, col){
            var self = this;
            widget.setPosition(self._containerW * (col-1)/self._cols, (self._rows - row) * self._itemH);
        }
        _setPosByBottom(widget, row, col){
            var self = this;
            var cH = self._containerH, iH = self._itemH;
            var marginH = self._marginH != null ? self._marginH : (cH - iH * self._rows)/ self._rows;
            widget.x = self._containerW * (col-1)/self._cols;
            widget.y = (self._rows - row + 1) * (self._itemH + marginH);
        }
    
        _createItemWidget(){
            return uiReader.genWidget(this._itemJsonPath);
        }
        /**
         * 通过此接口进行视图的重置
         * @param dataList
         */
        resetByData(dataList){
            var self = this, dList = self._dataList, itemWidgets = self._itemWidgets;
            dList.length = 0;//重置掉
            var i = 0;
            var l = dataList.length;
            var col = 1;
            var row = 1;
            self._rows = Math.ceil(l / self._cols);//获取行数
            for(; i < l; ++i){//遍历数据
                dList.push(dataList[i]);
                if(col > self._cols){//换行
                    col = 1;
                    row++;
                }
                var data = dataList[i];
                var widget = itemWidgets[i];
                if(!widget){
                    widget = itemWidgets[i] = self._createItemWidget();
                    self.widget.addChild(widget);
                    self._initItemWidget(widget);
                }else{
                    widget.setVisible(true);
                }
                //设置数据
                widget.itemIndex = i;
                self._resetItemByData(widget, data, i);
                //获取项的高度
                if(!self._itemH) {
                    self._itemH = widget.getSize().height;
                }
                if(!self._itemW){
                    self._itemW = self._containerW / self._cols;
                }

                if(self._layout == self.__class.LAYOUT_AVG){
                    self._setPosByAvg(widget, row, col);
                }else if(self._layout == self.__class.LAYOUT_TOP){
                    self._setPosByTop(widget, row, col);
                }else if(self._layout == self.__class.LAYOUT_BOTTOM){
                    self._setPosByBottom(widget, row, col);
                }
    
                col++;
            }
            for(;i < itemWidgets.length; ++i){
                itemWidgets[i].setVisible(false);
            }
            if(self._resizeContainer){
                var totalHeight = self.getRowTotalHeight();
                self.setSize(self.widget.getSize().width, totalHeight);
            }
        }
    
        setLayoutType(type){
            this._layout = type;
        }
    
        setSize(width, height){
            var self = this;
            var widget = self.widget;
            widget.setSize.apply(widget, arguments);
            self._containerW = widget.getSize().width;
            self._containerH = widget.getSize().height;
        }
    
        getSize(){
            return this.widget.getSize();
        }
    
        /**
         * 获取总行数累加的高度
         */
        getRowTotalHeight(){
            return this._rows * this._itemH + (this._rows -1) * this._marginH;
        }
    
        cellAtIndex(index):egret.DisplayObject{
            var children = this.widget.getChildren();
            return children[index];
        }
    
        setMarginHeight(height){
            this._marginH = height;
        }
    }
}