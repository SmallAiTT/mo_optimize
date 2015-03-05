module mo_ui.LoadingBarType {
    export var LEFT = 0;
    export var RIGHT = 1;
}

module mo_ui {
    export class UILoadingBar extends UIWidget {
        static __className:string = "UILoadingBar";
        static SWITCH_MODE_POSITIVE:number = 1; //进度满足当前最大值时，主动切换到下一阶的进度(一般使用，比如：吃经验)
        static SWITCH_MODE_NEGATIVE:number = 2; //进度满足当前最大值时，不主动切换到下一阶的进度(专属锻造中使用)
        static SWITCH_MODE_DEFAULT:number = 1;


        static BAR_OPTION_CLASS:mo_opt._UILoadingBarOption;

        _barOption:mo_opt._UILoadingBarOption;

        //@override
        _initProp(){
            super._initProp();
            var self = this;
            self._barOption = new mo_opt._UILoadingBarOption();
        }

        /**
         * 改变进度条方向，默认左边到右边
         * 0,左到右  1,右到左
         * @param {Number} dir
         */
        public setDirection(dir:number) {
            var self = this, barOption = self._barOption;
            if (barOption.barType == dir) {
                return;
            }
            barOption.barType = dir;
        }

        /**
         * 获取进度条的方向
         * @returns {Number}
         */
        public getDirection():number {
            return this._barOption.barType;
        }

        /**
         * 给进度条加一个资源
         * @param {String||egret.Texture} fileName
         */
        public loadTexture(fileName:any) {
            var self = this;
            res.getStatusRes(fileName, function(resData){
                var texture = self._barOption.texture = resData;
                self._setWidth(texture.textureWidth);
                self._setHeight(texture.textureHeight);
            }, self, egret.Texture);
        }

        /**
         * 改变进度
         * @param {number} percent
         */
        public setPercent(percent:number) {
            var self = this;
            if (percent < 0) {
                percent = 0;
            }
            else if (percent > 100) {
                percent = 100;
            }

            self._barOption.percent = percent;
        }

        /**
         * 获取进度
         * @returns {number}
         */
        public getPercent():number {
            return this._barOption.percent;
        }

        public _render(renderContext:egret.RendererContext):void {
            var self = this, barOption = self._barOption;
            var texture = self._texture_to_render = barOption.texture;
            if(!texture) return;

            //绘制loadingbar的底图
            var renderFilter = egret.RenderFilter.getInstance();
            var bitmapWidth:number = texture._bitmapWidth||texture._textureWidth;
            var bitmapHeight:number = texture._bitmapHeight||texture._textureHeight;

            var percent = barOption.percent, clipWidth;
            if(barOption.barType == LoadingBarType.LEFT){
                clipWidth = 0 | (bitmapWidth * percent / 100);
                renderFilter.drawImage(renderContext, this, texture._bitmapX, texture._bitmapY,
                    clipWidth, bitmapHeight, texture._offsetX, texture._offsetY, clipWidth, bitmapHeight);
            }
            //todo 右边向左边的先不做了
//            else if(barOption.barType == LoadingBarType.RIGHT){
//                clipWidth = 0 | bitmapWidth * (100 - percent) / 100;
//                var clipWidth1 = bitmapWidth - clipWidth;
//                renderFilter.drawImage(renderContext, this, texture._bitmapX + clipWidth, texture._bitmapY,
//                    bitmapWidth, bitmapHeight, texture._offsetX + clipWidth, texture._offsetY, clipWidth1, bitmapHeight);
//            }
            super._render(renderContext);
        }

        /**
         * @param loadingBar
         */
        public copySpecialProps(loadingBar:UILoadingBar) {
            var barOption2 = loadingBar._barOption;
            this.setPercent(barOption2.percent);
            this.setDirection(barOption2.barType);
        }

        //++++++++++++++++++++++extend 开始======================
        setOption(option){
        if(option == null) return option;
            var self = this;
            option = super.setOption(option);
            if(option.value) {
                var value = option.value;
                this.setPercent(value);
            }
            return option;
        }

        /**
         * @param cur
         * @param total
         * @param str
         */
        setProgress (cur, total?, str?){
            var self = this, barOption = self._barOption;
            if(typeof arguments[0] == "object"){
                var args = arguments[0];
                cur = args.cur;
                total = args.total;
                str = args.str;
            }

            var innerLabel = barOption.innerLabel;
            if(!innerLabel){
                var fontSize = self.height * 0.7;
                innerLabel = barOption.innerLabel = UIText.create();
                innerLabel.setFontSize(fontSize);
                innerLabel.setFontName("微软雅黑");
                innerLabel.enableStroke(cc.c3b(30, 30, 30), 3);
                innerLabel.zOrder = 9999;
                innerLabel.setAnchorPoint(0.5, 0.5);
                innerLabel.setPosition(self.width/2, self.height/2);
                self.addChild(innerLabel);
            }

            var percent = !total ? 100 : (0 | (cur/total * 100));
            if(percent > 100){
                percent = 100;
            }

            if(str){
                innerLabel.setText(str);
            }
            else{
                innerLabel.setText((0|cur) + "/" + total);
            }

            barOption.curValue = cur;
            barOption.totalValue = total;
            self._setProgressPercent(percent);
            if(barOption.actionQueueRunning){
                if(barOption.runningActionCb) barOption.runningActionCb.call(barOption.runningActionCbTarget, barOption.curBaseNumIndex, barOption.curValue, barOption.totalValue);
            }
        }

        _setProgressPercent(percent){
            this.setPercent(percent);
            this.setLightWidgetPosition();
        }

        getCurValue(){
            return this._barOption.curValue;
        }

        getTotalValue(){
            return this._barOption.totalValue;
        }

        /**
         * @param {mo.UIWidget|String} texture
         */
        loadLightTexture(texture){
            var self = this, barOption = self._barOption;
            if(typeof texture == "string"){
                var lightWidget = barOption.lightWidget;
                if(!lightWidget){
                    lightWidget = barOption.lightWidget = UIImage.create();
                    lightWidget.setAnchorPoint(0.5, 0.5);
                    lightWidget.zOrder = 9998;
                    self.addChild(lightWidget);
                }
                lightWidget.loadTexture(texture);
            }
            else{
                barOption.lightWidget = texture;
            }
            barOption.lightWidget.setVisible(false);
            self.setLightWidgetPosition();
        }

        setLightWidgetPosition(){
            var lightWidget = this._barOption.lightWidget;
            if(lightWidget){
                var size = this.getSize(),percent = this.getPercent();
                var x = percent/100 * size.width, y = size.height/2;
                lightWidget.setPosition(x,y);
            }
        }

        getLightWidget():UIImage{
            return this._barOption.lightWidget;
        }

        getInnerLabel():UIText{
            return this._barOption.innerLabel;
        }

        /**
         *  停止动态进度条，直接设置最终进度值
         */
        stopQueueRunning(){
            var self = this, barOption = self._barOption;
            if(barOption.actionQueueRunning){
                self._stopShakeLight();
                mo.clearTick(self._runActionQueue, self);
                barOption.actionQueueRunning = false;
                barOption.diffValue = 0;
                barOption.curTargetValue = barOption.finalTargetValue;
                self.setProgress(barOption.finalCurValue, barOption.finalTotalValue);
                if(barOption.stopActionCb){
                    var opt = {
                        index : barOption.curBaseNumIndex,
                        isMax : ((barOption.curBaseNumIndex == barOption.queueBaseNumber.length-1)
                        && (barOption.finalCurValue == barOption.finalTotalValue)),
                        curValue: barOption.finalCurValue,
                        totalValue: barOption.finalTotalValue
                    };
                    barOption.stopActionCb.call(barOption.stopActionCbTarget, opt);
                }
            }
        }

        /**
         * 重置进度条所有状态
         */
        resetSelf(){//TODO 这个应该用reset来代替就好了
            var self = this;
            self._barOption.reset();
            self.stopQueueRunning();
            self.setProgress(0, 0);
        }

        reset(){
            super.reset();
            var self = this;
            self._barOption.reset();
            self.stopQueueRunning();
            self.setProgress(0, 0);
        }

        /**
         * 底数，例如： [100,200,300]
         * @param {Array} arr
         */
        setProgressQueueBaseNumber(arr, switchMode?){
            var self = this, barOption = self._barOption;
            barOption.switchMode = switchMode || self.__class.SWITCH_MODE_POSITIVE;
            self.resetSelf();
            barOption.queueBaseNumber = arr;
            barOption.totalValue = arr[0];
            var sum = 0;
            for(var i in arr){
                var intV = parseInt(arr[i]);
                arr[i] = intV;
                sum +=intV;
            }
            barOption.queueBaseNumberSum = sum;
        }

        /**
         * 获取底数
         */
        getProgressQueueBaseNumber(){
            return this._barOption.queueBaseNumber;
        }

        /**
         * 基数之和
         * @returns {null}
         */
        getSumOfQueueBaseNumbers(){
            return this._barOption.queueBaseNumberSum;
        }

        /**
         * 调整跑进度条时的两个参数
         * @private
         */
        _normalTargetAndFinalValue(){
            var self = this, barOption = self._barOption;
            if(barOption.finalTargetValue <= 0){
                barOption.finalTargetValue = 0;
                barOption.finalCurValue = 0;
                barOption.finalTotalValue =  barOption.queueBaseNumber[0];
                return;
            }

            if(barOption.finalTargetValue >= barOption.queueBaseNumberSum){
                barOption.finalTargetValue = barOption.queueBaseNumberSum;
                barOption.finalCurValue = barOption.queueBaseNumber[barOption.queueBaseNumber.length-1];
                barOption.finalTotalValue =  barOption.queueBaseNumber[barOption.queueBaseNumber.length-1];
                return;
            }

            var arr = barOption.queueBaseNumber;
            var total = 0, flag;
            for(var i = 0, li = arr.length; i < li; i++){
                var baseNumber = arr[i];
                total += baseNumber;
                barOption.finalTotalValue = baseNumber;
                flag = (barOption.switchMode == self.__class.SWITCH_MODE_POSITIVE)? barOption.finalTargetValue < total : barOption.finalTargetValue <= total;
                if(flag){
                    barOption.finalCurValue = barOption.finalTargetValue - (total - baseNumber);
                    break;
                }else{
                    if(i == li -1){
                        barOption.finalTargetValue = total;
                        barOption.finalCurValue = baseNumber;
                    }
                }
            }
        }

        _beginShakeLight(){
            var self = this, barOption = self._barOption, lightWidget = barOption.lightWidget;
            if(lightWidget){
                var seq = mo.repeatForever(
                    mo.sequence(
                        mo.fadeTo(0.3, 255),
                        mo.fadeTo(0.3, 200)
                    )
                );
                lightWidget.setVisible(true);
                lightWidget.runAction(seq);
            }
        }

        _stopShakeLight(){
            var self = this, barOption = self._barOption, lightWidget = barOption.lightWidget;
            if(lightWidget){
                lightWidget.setVisible(false);
                lightWidget.stopAllActions();
            }
        }

        /**
         * 单次增加多少
         * @param diffValue
         * @param cb
         * @param cbTarget
         */
        runProgressQueue(diffValue, cb, cbTarget){
            var self = this, barOption = self._barOption;
            if(!barOption.queueBaseNumber){
                logger.error("队列的底数不能为空啊亲");
                return;
            }
            if(barOption.finalTargetValue == null){
                logger.error("请先调用setCurTargetValue设置targetValue");
                return;
            }

            barOption.runActionQueueCb = cb;
            barOption.runActionQueueCbTarget = cbTarget;

            barOption.diffValue += diffValue;
            barOption.finalTargetValue += diffValue;
            self._normalTargetAndFinalValue();

            if(barOption.actionQueueRunning) return;
            barOption.actionQueueRunning = true;
            mo.tick(self._runActionQueue, self);
            this._beginShakeLight();
        }

        /**
         * 运行到目标数值
         * @param targetValue 目标数值
         * @param cb
         * @param cbTarget
         */
        runProgressQueue2(targetValue, cb, cbTarget){
            var self = this, barOption = self._barOption;
            if(!barOption.queueBaseNumber){
                logger.error("队列的底数不能为空啊亲");
                return;
            }
            if(barOption.finalTargetValue == null){
                logger.error("请先调用setCurTargetValue设置targetValue");
                return;
            }

            barOption.runActionQueueCb = cb;
            barOption.runActionQueueCbTarget = cbTarget;

            barOption.diffValue += targetValue - barOption.finalTargetValue;
            barOption.finalTargetValue = targetValue;
            self._normalTargetAndFinalValue();

            if(barOption.actionQueueRunning) return;
            barOption.actionQueueRunning = true;
            mo.tick(self._runActionQueue, self);

            this._beginShakeLight();
        }

        onStopRunningProgress(cb, target){
            var self = this, barOption = self._barOption;
            barOption.stopActionCb = cb;
            barOption.stopActionCbTarget = target;
        }

        onRunningProgress(cb, target){
            var self = this, barOption = self._barOption;
            barOption.runningActionCb = cb;
            barOption.runningActionCbTarget = target;
        }

        onExit (){
            super.onExit.apply(this);
            var self = this, barOption = self._barOption;
            barOption.runActionQueueCb = null;
            barOption.runActionQueueCbTarget = null;
            self.stopQueueRunning();
        }

        _getBaseNumIndex(targetValue){
            var self = this, barOption = self._barOption;
            var arr = barOption.queueBaseNumber;
            var baseNumIndex = arr.length - 1;
            var total = 0, flag;
            for(var i = 0, li = arr.length; i < li; i++){
                total += arr[i];
                flag = (barOption.switchMode == self.__class.SWITCH_MODE_POSITIVE)? targetValue < total : targetValue <= total;
                if(flag){
                    baseNumIndex = i;
                    break;
                }
            }
            return baseNumIndex;
        }

        /**
         * 通过现有值和索引设置目标进度
         * @param curValue 该槽现有值 (e.g. 专属装备服务器剩余经验)
         * @param baseNumIndex 该槽总值在基数数组中的索引值 (e.g. 装备待升的等级)
         *
         */
        setCurTargetValue(curValue, baseNumIndex){
            var self = this, barOption = self._barOption;
            var arr = barOption.queueBaseNumber;
            if(!arr){
                logger.error("你没有设置基数数组啊！");
                return
            }
            if(baseNumIndex > arr.length){
                logger.error("索引 %s 超出基数数组的大小了啊！", baseNumIndex);
                return
            }
            barOption.curBaseNumIndex = baseNumIndex;

            var total = curValue;
            for(var i = 0, li = baseNumIndex; i < li; i++){
                total +=  arr[i];
            }
            barOption.curTargetValue = total;

            // 如果是直接设置的进度，则应该同时调整动态进度条相关的值
            if(!barOption.actionQueueRunning){
                barOption.finalTargetValue = barOption.curTargetValue;
                barOption.diffValue = 0;
                self._normalTargetAndFinalValue();
                self.setProgress(barOption.finalCurValue, barOption.finalTotalValue);
            }
        }

        _runActionQueue(dtByMs){
            var dt = dtByMs/1000; //转换成秒
            var self = this, barOption = self._barOption;
            if (barOption.diffValue == 0) {
                self.stopQueueRunning();
            }
            else {
                var baseNumberArr = this.getProgressQueueBaseNumber();
                var index = self._getBaseNumIndex(barOption.curTargetValue);
                var baseNumber = baseNumberArr[index];

                // 计算变化量
                var deltaValue, newValue;
                deltaValue = baseNumber * dt * (barOption.diffValue > 0? 1 : -1);

                if (Math.abs(deltaValue) > Math.abs(barOption.diffValue)) {
                    newValue = barOption.curValue + barOption.diffValue;
                    newValue = Math.round(newValue);
                    barOption.diffValue = 0;
                }
                else {
                    barOption.diffValue -= deltaValue;
                    newValue = barOption.curValue + deltaValue;
                }

                var flag;
                flag = (barOption.switchMode == self.__class.SWITCH_MODE_POSITIVE)? newValue >= baseNumber : newValue > baseNumber;
                // 前进到了下一基数
                if (deltaValue > 0 && flag) {
                    if((index+1) < baseNumberArr.length){
                        newValue = newValue - baseNumber;
                        index++;
                    }else{
                        index = baseNumberArr.length - 1;
                        newValue = baseNumber;
                        barOption.diffValue = 0;
                    }
                    //执行基数变化回调
                    if (barOption.runActionQueueCb) barOption.runActionQueueCb.call(barOption.runActionQueueCbTarget, index, baseNumberArr[index], this);
                }

                flag = (barOption.switchMode == self.__class.SWITCH_MODE_POSITIVE)? newValue < 0 : newValue <= 0;
                // 回退到了上一个基数
                if(deltaValue < 0 && flag){
                    if(index - 1 < 0){
                        index = 0;
                        newValue = 0;
                        barOption.diffValue = 0;
                    }else{
                        index--;
                        newValue = baseNumberArr[index] + newValue;
                    }
                    //执行基数变化回调
                    if (barOption.runActionQueueCb) barOption.runActionQueueCb.call(barOption.runActionQueueCbTarget, index, baseNumberArr[index], this);
                }
                self.setProgress(newValue, baseNumberArr[index]);
                self.setCurTargetValue(newValue, index);
            }
        }

        /**
         * 增量
         * @param duration
         * @param diffPercent
         */
        runProgressBy(duration, diffPercent){
            var percent = diffPercent + this.getPercent();
            var progress = mo.action.ProgressTo.create(duration, percent);
            this.runAction(progress);
        }

        /**
         * 从当前到y
         * @param duration
         * @param percent
         */
        runProgressTo(duration, percent){
            var progress = mo.action.ProgressTo.create.apply(null, arguments);
            this.runAction(progress);
        }

        /**
         * 从x到y
         * @param duration
         * @param fromPercentage
         * @param toPercentage
         */
        runProgressFromTo(duration, fromPercentage, toPercentage){
            var progress = mo.action.ProgressFromTo.create.apply(null, arguments);
            this.runAction(progress);
        }

        //++++++++++++++++++++++extend 结束======================
    }
}