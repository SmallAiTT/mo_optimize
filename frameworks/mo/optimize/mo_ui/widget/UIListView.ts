module mo_ui.ListViewEventType {
    export var listViewOnselectedItem:number = 0;
}

module mo_ui.ListViewGravity {
    export var left:number = 0;
    export var right:number = 1;
    export var centerHorizontal:number = 2;
    export var top:number = 3;
    export var bottom:number = 4;
    export var centerVertical:number = 5;
}

module mo_ui {
    export class UIListView extends UIScrollView {
        static __className:string = "UIListView";

        _model:UIWidget;
        _items:Array<UIWidget>;
        _gravity:number;
        _itemsMargin:number;
        _listViewEventListener:any;
        _listViewEventSelector;
        _curSelectedIndex:number;
        _refreshViewDirty:boolean;

        _initProp() {
            super._initProp();

            this._items = [];
            this._gravity = ListViewGravity.centerHorizontal;
            this._itemsMargin = 0;
            this._curSelectedIndex = 0;
            this._refreshViewDirty = true;
        }

        _init() {
            super._init.call(this);
            this.setLayoutType(LayoutType.linearVertical);
        }

        /**
         * Sets a item model for listview. A model will be cloned for adding default item.
         * @param {UIWidget} model
         */
        setItemModel(model:UIWidget) {
            if (!model) {
                return;
            }
            this._model = model;
        }

        updateInnerContainerSize() {
            switch (this._scrollOption.direction) {
                case ScrollViewDir.vertical:
                    var length = this._items.length;
                    var totalHeight = (length - 1) * this._itemsMargin;
                    for (var i = 0; i < length; i++) {
                        var item = this._items[i];
                        totalHeight += item.getSize().height;
                    }
                    var finalWidth = this.getSize().width;
                    var finalHeight = totalHeight;
                    this.setInnerContainerSize(mo.size(finalWidth, finalHeight));
                    break;
                case ScrollViewDir.horizontal:
                    var length = this._items.length;
                    var totalWidth = (length - 1) * this._itemsMargin;
                    for (var i = 0; i < length; i++) {
                        var item = this._items[i];
                        totalWidth += item.getSize().width;
                    }
                    var finalWidth = totalWidth;
                    var finalHeight = this.getSize().height;
                    this.setInnerContainerSize(mo.size(finalWidth, finalHeight));
                    break;
                default:
                    break;
            }
        }

        remedyLayoutParameter(item) {
            if (!item) {
                return;
            }
            switch (this._scrollOption.direction) {
                case ScrollViewDir.vertical:
                    var llp = item.getLayoutParameter(LayoutParameterType.linear);
                    if (!llp) {
                        var defaultLp = LinearLayoutParameter.create();
                        switch (this._gravity) {
                            case ListViewGravity.left:
                                defaultLp.setGravity(LinearGravity.left);
                                break;
                            case ListViewGravity.right:
                                defaultLp.setGravity(LinearGravity.right);
                                break;
                            case ListViewGravity.centerHorizontal:
                                defaultLp.setGravity(LinearGravity.centerHorizontal);
                                break;
                            default:
                                break;
                        }
                        if (this.getIndex(item) == 0) {
                            defaultLp.setMargin(new Margin(0,0,0,0));
                        }
                        else {
                            defaultLp.setMargin(new Margin(this._itemsMargin, 0.0, 0.0, 0.0));
                        }
                        item.setLayoutParameter(defaultLp);
                    }
                    else {
                        if (this.getIndex(item) == 0) {
                            llp.setMargin(new Margin(0,0,0,0));
                        }
                        else {
                            llp.setMargin(new Margin(this._itemsMargin, 0, 0, 0));
                        }
                        switch (this._gravity) {
                            case ListViewGravity.left:
                                llp.setGravity(LinearGravity.left);
                                break;
                            case ListViewGravity.right:
                                llp.setGravity(LinearGravity.right);
                                break;
                            case ListViewGravity.centerHorizontal:
                                llp.setGravity(LinearGravity.centerHorizontal);
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                case ScrollViewDir.horizontal:
                    var llp = item.getLayoutParameter(LayoutParameterType.linear);
                    if (!llp) {
                        var defaultLp = LinearLayoutParameter.create();
                        switch (this._gravity) {
                            case ListViewGravity.top:
                                defaultLp.setGravity(LinearGravity.top);
                                break;
                            case ListViewGravity.bottom:
                                defaultLp.setGravity(LinearGravity.bottom);
                                break;
                            case ListViewGravity.centerVertical:
                                defaultLp.setGravity(LinearGravity.centerVertical);
                                break;
                            default:
                                break;
                        }
                        if (this.getIndex(item) == 0) {
                            defaultLp.setMargin(new Margin(0,0,0,0));
                        }
                        else {
                            defaultLp.setMargin(new Margin(0.0, 0.0, 0.0, this._itemsMargin));
                        }
                        item.setLayoutParameter(defaultLp);
                    }
                    else {
                        if (this.getIndex(item) == 0) {
                            llp.setMargin(new Margin(0,0,0,0));
                        }
                        else {
                            llp.setMargin(new Margin(0.0, 0.0, 0.0, this._itemsMargin));
                        }
                        switch (this._gravity) {
                            case ListViewGravity.top:
                                llp.setGravity(LinearGravity.top);
                                break;
                            case ListViewGravity.bottom:
                                llp.setGravity(LinearGravity.bottom);
                                break;
                            case ListViewGravity.centerVertical:
                                llp.setGravity(LinearGravity.centerVertical);
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        /**
         * Push back a default item(create by a cloned model) into listview.
         */
        pushBackDefaultItem() {
            var self = this;
            if (!self._model) {
                return;
            }
            var newItem = self._model.clone();
            self._items.push(newItem);
            self.remedyLayoutParameter(newItem);
            self.addChild(newItem);
            self._refreshViewDirty = true;
            self._dirty = true;
        }

        /**
         * Insert a default item(create by a cloned model) into listview.
         * @param {Number} index
         */
        insertDefaultItem(index:number) {
            var self = this;
            if (!self._model) {
                return;
            }
            var newItem = self._model.clone();
            mo_arr.ArrayAppendObjectToIndex(self._items, newItem, index);
            self.remedyLayoutParameter(newItem);
            self.addChild(newItem);
            self._refreshViewDirty = true;
            self._dirty = true;
        }

        /**
         * Push back custom item into listview.
         * @param {UIWidget} item
         */
        pushBackCustomItem(item:UIWidget) {
            var self = this;
            self._items.push(item);
            self.remedyLayoutParameter(item);
            self.addChild(item);
            self._refreshViewDirty = true;
            self._dirty = true;
        }

        /**
         * Push back custom item into listview.
         * @param {UIWidget} item
         * @param {Number} index
         */
        insertCustomItem(item:UIWidget, index:number) {
            var self = this;
            mo_arr.ArrayAppendObjectToIndex(self._items, item, index);
            self.remedyLayoutParameter(item);
            self.addChild(item);
            self._refreshViewDirty = true;
            self._dirty = true;
        }

        /**
         * Removes a item whose index is same as the parameter.
         * @param {Number} index
         */
        removeItem(index:number) {
            var self = this;
            var item = self.getItem(index);
            if (!item) {
                return;
            }
            mo_arr.ArrayRemoveObject(self._items, item);
            self.removeChild(item);
            self._refreshViewDirty = true;
            self._dirty = true;
        }

        /**
         * Removes the last item of listview.
         */
        removeLastItem() {
            this.removeItem(this._items.length - 1);
        }

        /**
         * Returns a item whose index is same as the parameter.
         * @param {Number} index
         * @returns {UIWidget}
         */
        getItem(index:number):UIWidget {
            if (index < 0 || index >= this._items.length) {
                return null;
            }
            return this._items[index];
        }

        /**
         * Returns the item container.
         * @returns {Array}
         */
        getItems() {
            return this._items;
        }

        /**
         * Returns the index of item.
         * @param {UIWidget} item
         * @returns {Number}
         */
        getIndex(item:UIWidget):number {
            return mo_arr.ArrayGetIndexOfObject(this._items, item);
        }

        /**
         * Changes the gravity of listview.
         * @param {Number} gravity
         */
        setGravity(gravity:number) {
            var self = this;
            if (self._gravity == gravity) {
                return;
            }
            self._gravity = gravity;
            self._refreshViewDirty = true;
            self._dirty = true;
        }

        /**
         * Changes the margin between each item.
         * @param {Number} margin
         */
        setItemsMargin(margin:number) {
            var self = this;
            if (self._itemsMargin == margin) {
                return;
            }
            self._itemsMargin = margin;
            self._refreshViewDirty = true;
            self._dirty = true;
        }

        /**
         * Get the margin between each item.
         * @returns {Number}
         */
        getItemsMargin():number {
            return this._itemsMargin;
        }

        /**
         * Changes scroll direction of scrollview.
         * @param {Number} dir
         */
        _setDirection(dir:number) {
            switch (dir) {
                case ScrollViewDir.vertical:
                    this.setLayoutType(LayoutType.linearVertical);
                    break;
                case ScrollViewDir.horizontal:
                    this.setLayoutType(LayoutType.linearHorizontal);
                    break;
                case ScrollViewDir.both:
                    return;
                default:
                    return;
                    break;
            }
            super._setDirection.call(this, dir);

        }

        /**
         *  add event listener
         * @param {Function} selector
         * @param {Object} target
         */
        addEventListenerListView(selector:Function, target:any) {
            this._listViewEventListener = target;
            this._listViewEventSelector = selector;
        }

        selectedItemEvent() {
            if (this._listViewEventSelector && this._listViewEventListener) {
                this._listViewEventSelector.call(this._listViewEventListener, this, ListViewEventType.listViewOnselectedItem);
            }
        }

        /**
         * get current selected index
         * @returns {number}
         */
        getCurSelectedIndex():number {
            return this._curSelectedIndex;
        }

        /**
         * request refresh view
         */
        requestRefreshView() {
            this._refreshViewDirty = true;
            this._dirty = true;
        }

        refreshView() {
            for (var i = 0; i < this._items.length; i++) {
                var item = this._items[i];
                item.setZOrder(i);
                this.remedyLayoutParameter(item);
            }
            this.updateInnerContainerSize();
        }

        sortChildren(){
            var self = this;
            if (self._refreshViewDirty) {
                self.refreshView();
                self._refreshViewDirty = false;
            }
            super.sortChildren();
        }

        _onVisit() {
            super._onVisit();
            if (this._refreshViewDirty) this.refreshView();
        }
        _onAfterVisit(){
            super._onAfterVisit();
            this._refreshViewDirty = false;
        }

        _onNodeSizeDirty() {
            super._onNodeSizeDirty();
            this._refreshViewDirty = true;
            this._dirty = true;
        }

        copyClonedWidgetChildren(model:UIListView) {
            var arrayItems = model.getItems();
            for (var i = 0; i < arrayItems.length; i++) {
                var item = arrayItems[i];
                this.pushBackCustomItem(item.clone());
            }
        }

        copySpecialProps(listView:UIListView) {
            super.copySpecialProps.call(this, listView);
            this.setItemModel(listView._model);
            this.setItemsMargin(listView._itemsMargin);
            this.setGravity(listView._gravity);
        }
    }
}