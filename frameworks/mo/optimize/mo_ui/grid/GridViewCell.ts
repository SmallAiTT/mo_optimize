module mo_ui {
    export class GridViewCell extends UIPanel {
        static __className:string = "GridViewCell";

        _row:number;// INVALID_INDEX,
        _idx:number;// INVALID_INDEX,
        _jsonPath:string;
        _uiWidget:any;
        _cellSize:mo.Size;

        _clickWidgetName:string;
        _useClickEffect:boolean;

        _originPos:any;

        listenersInited:boolean;

        resetByData(data:any, ...args:any[]){
            logger.warn(mo_code.c_103);
        }

        //@override
        _initProp() {
            super._initProp();
            var self = this;
            self._clickWidgetName = "touch_panel";
            self._useClickEffect = false;
            this._row = -1;
            this._idx = -1;
        }


        //@override
        public init(...args:any[]){
            super.init();
            var self = this;

            self.ignoreContentAdaptWithSize(false);
            self.setAnchorPoint(mo.p(0.5, 0.5));
            if(self._jsonPath){
                self.initWithFilePath(self._jsonPath);
            }

            if(self._clickWidgetName){
                var widget = self.getWidgetByName(self._clickWidgetName);
                if(widget){
                    widget.touchEnabled = true;
                    if(self._useClickEffect){
                        var widget = self.getWidgetByName(self._clickWidgetName);
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
            var self = this;
            if(self._useClickEffect) {
                var widget = self.getWidgetByName(self._clickWidgetName);
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
            return this._uiWidget;
        }

        initWithFilePath (jsonPath){
            if(!this._uiWidget){
                this._jsonPath = jsonPath;
                this._uiWidget = uiReader.genWidget(this._jsonPath);
                this.addChild(this._uiWidget);
                this.setSize(this._uiWidget.getSize());
            }
        }

        /**
         * 获取cell的index
         * @returns {number}
         */
        getIdx () {
            return this._idx;
        }

        /**
         * 设置cell的index
         * @param {number} idx
         */
        setIdx (idx) {
            this._idx = idx;
        }

        /**
         * 获取cell所在的列数
         * @returns {number}
         */
        getRow () {
            return this._row;
        }

        /**
         * 设置cell所在的列数
         * @param {number} row
         */
        setRow (row) {
            this._row = row;
        }

        /**
         * 重置这个cell
         */
        reset () {
            this._idx = -1;
            this._row = -1;
        }

        /**
         * 设置cellSize大小
         * @param {number} cellSize
         */
        setCellSize (cellSize) {
            if(this._uiWidget){
                //居中
                this._uiWidget.x = (cellSize.width - this._uiWidget.width)/2;
                this._uiWidget.y = (cellSize.height - this._uiWidget.height)/2;
            }
            this._cellSize = cellSize;
        }

        /**
         * 获取cellSize
         */
        getCellSize () {
            return this._cellSize;
        }
    }
}
