/**
 * Created by lihex on 1/17/15.
 */

module mo_ui {
    export class LinearVerticalCtrl extends WidgetCtrl {

        _tpName;
        _tpWidget;
        _itemWidgets;

        _dataSourceAdapterSelector;
        _dataSourceAdapterTarget;
        _itemCount;

        _itemWidgetCreateSelector;
        _itemWidgetCreateTarget;

        //@override
        _initProp() {
            super._initProp();
        }

        /**
         * @param container 容器panel
         * @param templateName(string 模板项名|function构建模板项的回调)
         * @param target
         */
        init(container:UIPanel, templateName?, target?){
            super.init();
            var self = this;
            container.autoSizeEnabled = true;
            self.widget = container;
            self._itemWidgets = [];

            self._tpName = templateName;
            if(self._tpName){
                self._tpWidget = self.getWidgetByName(self._tpName);
                self._tpWidget.isAutoDtor = false;
                self._itemWidgets.push(self._tpWidget);
            }
            if(typeof templateName == "function"){
                self.setWidgetCreateAdapter(templateName, target);
            }
        }

        //回收子项
        reclaimItemWidget(){
            var self = this, w, localWidgets = self._itemWidgets;
            for(var i = 0, li = localWidgets.length; i < li; i++){
                w = localWidgets[i];
                w.removeFromParent();
            }
        }

        /**
         *
         * @param count 数量|字典
         * @param selector
         * @param target
         */
        resetByData(count, selector?, target?){
            var self = this, w;
            self.reclaimItemWidget();
            if(selector){
                self.setDataSourceAdapter(selector, target);
            }
            var keys;
            if(typeof count == "object"){
                keys = Object.keys(count);
                self._itemCount = keys.length;
            }else{
                self._itemCount = count;
            }
            for(var i = 0, li = self._itemCount; i < li; i++){
                w = self._getItemWidget(i);
                self.widget.addChild(w);
                if(keys){
                    self._executeDataAdapterCallback(w, keys[i]);
                }else{
                    self._executeDataAdapterCallback(w, i);
                }
            }
            if(self._itemCount){
                (<UIPanel> self.widget).doLayout();
            }else{
                self.widget.setVisible(false);
                self.widget.height = 0;
            }
        }

        /**
         * 根据索引获得子项
         * @param index
         * @returns {any}
         * @private
         */
        _getItemWidget(index){
            var self = this;
            var localItemWidgets = self._itemWidgets;
            if(!localItemWidgets[index]){
                localItemWidgets[index] = self._createItemWidget();
            }
            return localItemWidgets[index];
        }

        /**
         * 创建子项
         * @returns {any}
         * @private
         */
        _createItemWidget(){
            var self = this;
            var w;
            if(self._tpWidget){
                w = self._tpWidget.clone();
                w.isAutoDtor = false;
            }else{
                w = this._itemWidgetCreateSelector.call(this._itemWidgetCreateTarget);
            }
            return w;
        }

        /**
         * 设置创建子项的回调
         * @param selector
         * @param target
         */
        setWidgetCreateAdapter(selector, target){
            this._itemWidgetCreateSelector = selector;
            this._itemWidgetCreateTarget = target;
        }

        /**
         * 设置数据设置回调
         * @param selector
         * @param target
         */
        setDataSourceAdapter(selector, target){
            this._dataSourceAdapterSelector = selector;
            this._dataSourceAdapterTarget = target;
        }

        _executeDataAdapterCallback(itemWidget, index){
            if (this._dataSourceAdapterSelector) {
                return this._dataSourceAdapterSelector.call(this._dataSourceAdapterTarget, itemWidget, index, this);
            }
        }

        dtor(){
            var self = this;
            var itemWidgets = self._itemWidgets;
            while(itemWidgets.length){
                itemWidgets.pop().doDtor();
            }
            self._itemWidgets = null;
            super.dtor();
        }

    }
}
