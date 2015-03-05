module mo_ui {
    export class GridPageIndex extends UIPanel {
        static __className:string = "GridPageView";

        _totalPageNum:number;
        _lastPageNum:number;
        _curPageNum:number;
        _lastPageIndex:number;
        _curPageIndex:number;
        _requiredPageIndexNum:number;
        _maxPageIndexNum:number;
        _pageIndexRenders:Array<UIImage>;
        _pageOnRender:UIImage;
        _offTexName:string;
        _onTexName:string;
        _spacing:number;
        _indexDirty:boolean;

        //@override
        _initProp() {
            super._initProp();
            var self = this;

            self._totalPageNum = 1;
            self._lastPageNum = 1;
            self._curPageNum = 1;
            self._lastPageIndex = 0;
            self._curPageIndex = 0;
            self._requiredPageIndexNum = 1;
            self._maxPageIndexNum = 5;
            self._offTexName = "";
            self._onTexName = "";
            self._spacing = 8;
            self._indexDirty = false;

            this._pageIndexRenders = [];
            this._pageOnRender = UIImage.create();
            this._pageIndexRenders.push(this._pageOnRender);
            mo.tick(this.update, this);
        }

        /**
         * 加载图标
         * @param on
         * @param off
         */
        loadTextures(on:string, off:string) {
            this.loadOnTexture(on);
            this.loadOffTexture(off);
        }

        /**
         *  加载灰色图标
         * @param off 资源名
         */
        loadOffTexture(off:string) {
            if (!off) {
                return;
            }
            this._offTexName = off;

            var indexRenders = this._pageIndexRenders;
            for (var i = 1, li = indexRenders.length; i < li; i++) {
                indexRenders[i].loadTexture(off);
            }
        }

        /**
         * 加载高亮图标
         * @param on 资源名
         */
        loadOnTexture(on:string) {
            if (!on) {
                return;
            }
            this._onTexName = on;
            this._pageOnRender.loadTexture(on);
        }

        /**
         *  设置图标间距
         * @param spacing
         */
        setSpacing(spacing:number) {
            this._spacing = spacing;
            this._indexDirty = true;
        }

        drawPageIndexIcon() {
            var items = this._pageIndexRenders;
            var spacing = this._spacing;
            var iconSize = this._pageOnRender.getSize();

            if (!items)
                return;

            var itemLength = this._requiredPageIndexNum;
            var halfIconSize = mo.size(iconSize.width * 0.5, iconSize.height * 0.5);
            var pageIndexPos = mo.p(0, 0);
            var starPosition = (mo.Point.pAdd(
                pageIndexPos,
                mo.p(
                        -(Math.floor(itemLength * 0.5)) * (halfIconSize.width + spacing + halfIconSize.width),
                    0
                )
            ));

            var index, r, c;
            for (index = 0; index < itemLength; index++) {
                r = 1;
                c = index;
                var indexIcon = items[index];
                indexIcon.setPosition(
                    mo.Point.pAdd(
                        starPosition,
                        mo.p(
                                c * (halfIconSize.width + spacing + halfIconSize.width),
                            0
                        )
                    ));
                this.addChild(indexIcon);
            }
        }

        /**
         *  设置最多显示图标数
         * @param num
         */
        setMaxPageIndexNum(num:number) {
            if (num < 1) {
                this._maxPageIndexNum = 1;
            }
            this._maxPageIndexNum = num;

            this._indexDirty = true;
        }

        /**
         *  设置总页数
         * @param num
         */
        setTotalPageNum(num:number) {
            this._totalPageNum = num;
            this._requiredPageIndexNum = num;
            if (num < 1) {
                this._totalPageNum = 1;
                this._requiredPageIndexNum = 1;
            }
            if (num > this._maxPageIndexNum) {
                this._requiredPageIndexNum = this._maxPageIndexNum;
            }
            var curLength = this._pageIndexRenders.length;

            // 如果不够则添加
            var delta = 0;
            if (curLength < this._requiredPageIndexNum) {
                delta = this._requiredPageIndexNum - curLength;
            }
            var render;
            for (var i = 0; i < delta; i++) {
                render = UIImage.create();
                render.loadTexture(this._offTexName);
                this._pageIndexRenders.push(render);
            }
            this.setPageNum(this._curPageNum);

            this._indexDirty = true;
        }

        /**
         *  设置页码
         * @param num 从1开始
         */
        setPageNum(num:number) {
            this._curPageNum = num;
            if (num < 1) {
                this._curPageNum = 1;
            }
            if (num > this._totalPageNum) {
                this._curPageNum = this._totalPageNum;
            }

            var index, requiredPageIndexNum;
            requiredPageIndexNum = this._requiredPageIndexNum;
            if (this._curPageNum !== this._lastPageNum) {
                index = Math.round(requiredPageIndexNum * (this._curPageNum / this._totalPageNum));
                this._setPageIndex(index - 1);
                this._lastPageNum = this._curPageNum;
            }
        }

        /**
         *  设置页码索引
         * @param index 从0开始
         */
        _setPageIndex(index:number) {
            this._curPageIndex = index;
            if (index < 0) {
                this._curPageIndex = 0;
            }
            if (index >= this._requiredPageIndexNum) {
                this._curPageIndex = this._requiredPageIndexNum - 1;
            }
            if (this._curPageIndex !== this._lastPageIndex) {
                this._updateIndex();
            }
        }

        /**
         *  更新图标位置
         * @private
         */
        _updateIndex() {
            var self = this;
            var prePageIndex = this._lastPageIndex;
            var curPageIndex = this._curPageIndex;
            // 交换图标位置
            var preIcon = self._pageIndexRenders[prePageIndex];
            var curIcon = self._pageIndexRenders[curPageIndex];
            var tmpPos = mo.p(preIcon.getPosition().x, preIcon.getPosition().y);
            preIcon.setPosition(curIcon.getPosition().x, curIcon.getPosition().y);
            curIcon.setPosition(tmpPos);
            // 交换数据
            arraySwap(self._pageIndexRenders, prePageIndex, curPageIndex);
            this._lastPageIndex = this._curPageIndex;
        }

        update(dt:number) {
            if (this._indexDirty && this._pageOnRender._nodeOption.texture != null) {
                this._indexDirty = false;
                this.removeChildren();
                this.drawPageIndexIcon();
            }
        }

        dtor() {
            super.dtor();
            var self = this;
            mo.clearTick(this.update, this);
            self.removeChildren();
        }
    }

    function arraySwap (arr, oldIndex, newIndex) {
        arr[oldIndex] = arr.splice(newIndex, 1, arr[oldIndex])[0];
        return arr;
    }
}


