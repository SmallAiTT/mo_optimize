module mo_opt {
    export class _CellOption extends Option {
        row:number;
        idx:number;
        jsonPath:string;
        widget:any;
        cellSize:mo.Size;
        clickWidgetName:string;
        useClickEffect:boolean;
        originPos:any;
        listenerInited:boolean;
        listenerIniter:Function;
        listenerIniterCtx:any;
        data:any;

        //@override
        _initProp():void {
            super._initProp();
            var self = this;
            self.row = -1;
            self.idx = -1;
            self.cellSize = mo.size(0, 0);
            self.clickWidgetName = "touch_panel";
        }

        //@override
        dtor() {
            super.dtor();
            var self = this;
            self.widget = null;
            self.listenerIniter = null;
            self.listenerIniterCtx = null;
            self.data = null;
        }
    }
}

module mo_ui{
    export class UIGridCell extends UIPanel {
        static __className:string = "UIGridCell";

        _cellOption:mo_opt._CellOption;


        /**
         * 数据
         */
        public get data():any{
            return this._cellOption.data;
        }


        resetByData(data:any, ...args:any[]){
            this._cellOption.data = data;
           logger.warn(mo_code.c_103);
        }

        initListeners(){
            var self = this, cellOption = self._cellOption;
            if(!cellOption.listenerInited){
                cellOption.listenerInited = true;
                if(cellOption.listenerIniter) cellOption.listenerIniter.call(cellOption.listenerIniterCtx, self);
            }
        }

        registerListenerIniter(listenerIniter:Function, listenerIniterCtx:any){
            var cellOption = this._cellOption;
            cellOption.listenerIniter = listenerIniter;
            cellOption.listenerIniterCtx = listenerIniterCtx;
        }

        //@override
        _initProp() {
            super._initProp();
            var self = this;
            self._cellOption = new mo_opt._CellOption();
        }


        //@override
        public init(...args:any[]){
            super.init();
            var self = this, cellOption = self._cellOption;

            self.ignoreContentAdaptWithSize(false);
            self.setAnchorPoint(mo.p(0.5, 0.5));
            if(cellOption.jsonPath){
                self.initWithFilePath(cellOption.jsonPath);
            }

            if(cellOption.clickWidgetName){
                var widget = self.getWidgetByName(cellOption.clickWidgetName);
                if(widget){
                    widget.touchEnabled = true;
                    if(cellOption.useClickEffect){
                        var TE = mo_evt.TouchEvent;
                        widget.addEventListener(TE.NODE_BEGIN, self._onTouchBeginForClickWidget, self);
                        widget.addEventListener(TE.NODE_END, self._onTouchEndForClickWidget, self);
                    }
                    widget.onClick(self._onClick, self);
                }
            }
        }

        _onTouchBeginForClickWidget(){
            var self = this;
            self.setScale(1.05);
        }
        _onTouchEndForClickWidget(){
            var self = this;
            self.setScale(1);
        }

        dtor(){
            super.dtor();
            var self = this, cellOption = self._cellOption;
            if(cellOption.useClickEffect) {
                var widget = self.getWidgetByName(cellOption.clickWidgetName);
                var TE = mo_evt.TouchEvent;
                widget.removeEventListener(TE.NODE_BEGIN, self._onTouchBeginForClickWidget, self);
                widget.removeEventListener(TE.NODE_END, self._onTouchEndForClickWidget, self);
            }
        }

        _onClick (sender, event, data){
            var self = this;
            if(self._nodeOption.clickCb != null) {
                mo_evt.dispatchEvent([
                    [mo_evt.cellClickDispatcher, self.__className],
                ], self._doClick, self, data);
            }
        }

        getUIWidget (){
            return this._cellOption.widget;
        }

        initWithFilePath (jsonPath){
            var self = this, cellOption = self._cellOption;
            if(!cellOption.widget){
                cellOption.jsonPath = jsonPath;
                var widget = cellOption.widget = uiReader.genWidget(cellOption.jsonPath);
                self.addChild(widget);
                self._setWidth(widget.width);
                self._setHeight(widget.height);
            }
        }

        /**
         * 获取cell的index
         * @returns {number}
         */
        getIdx () {
            return this._cellOption.idx;
        }

        /**
         * 设置cell的index
         * @param {number} idx
         */
        setIdx (idx) {
            this._cellOption.idx = idx;
        }

        /**
         * 获取cell所在的列数
         * @returns {number}
         */
        getRow () {
            return this._cellOption.row;
        }

        /**
         * 设置cell所在的列数
         * @param {number} row
         */
        setRow (row) {
            this._cellOption.row = row;
        }

        /**
         * 重置这个cell
         */
        reset () {
            this._cellOption.idx = -1;
            this._cellOption.row = -1;
        }

        /**
         * 设置cellSize大小
         */
        setCellSize (cellSize:any, height?:number) {
            if(arguments.length == 1){
                height = cellSize.height;
                cellSize = cellSize.width;
            }
            var self = this, cellOption = self._cellOption;
            var widget = cellOption.widget;
            if(widget){
                //居中
                widget._setX((cellSize - widget.width)/2);
                widget._setY((height - widget.height)/2);
            }
            var cs = cellOption.cellSize;
            cs.width = cellSize;
            cs.height = cellSize;
        }

        /**
         * 获取cellSize
         */
        getCellSize () {
            return this._cellOption.cellSize;
        }
    }
}
