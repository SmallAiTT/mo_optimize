module mo_ui{

    export var _widgetByNameApi:IWidgetByNameApi = {

        getPositionByName : function(name:string){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                return widget.getPosition.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
            return null;
        },

        setPositionByName:function(name:string, x:any, y?:number){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                 widget.setPosition.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        setPositionOffsetByName:function(name:string, x:any, y?:number){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.setPositionOffset.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        setScaleByName:function(name:string, scaleX:any, scaleY?:number){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.setScale.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 缩放适配屏幕
         * @param widgetName
         * @param mode
         */
        setAdaptiveScaleByName: function(widgetName, mode){
            var widget:UIWidget = this.getWidgetByName(widgetName);
            if(widget){
                var parentSize = widget.getParent().getSize();
                var widgetSize = widget.getSize(), scaleX, scaleY, scaleValue;
                scaleX = parentSize.width/widgetSize.width;
                scaleY = parentSize.height/widgetSize.height;
                switch (mode){
                    case mo.RESOLUTION_POLICY.EXACT_FIT:
                        widget.setScaleX(scaleX);
                        widget.setScaleY(scaleY);
                        break;
                    case mo.RESOLUTION_POLICY.NO_BORDER:
                        scaleValue = Math.max(scaleX, scaleY);
                        widget.setScale(scaleValue);
                        break;
                    case mo.RESOLUTION_POLICY.SHOW_ALL:
                        scaleValue = Math.min(scaleX, scaleY);
                        widget.setScale(scaleValue);
                        break;
                    case mo.RESOLUTION_POLICY.FIXED_HEIGHT:
                        widget.setScaleY(scaleY);
                        break;
                    case mo.RESOLUTION_POLICY.FIXED_WIDTH:
                        widget.setScaleX(scaleX);
                        break;
                    default:
                        break;
                }
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        setSizeByName : function(name:string, width:any, height?:number){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.setSize.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        getSizeByName : function(name){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                return widget.getSize.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
            return null;
        },

        setVisibleByName : function(name:string, visible){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.setVisible.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        setGrayByName : function(name:string, isGray){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:any = this.getWidgetByName(name);
            if(widget){
                if(widget.setGray) widget.setGray.apply(widget, args);
                else logger.warn("缺失api【%s#setGray】", this.__className);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        setButtonImgByName: function(name:string, frameName:string){
            var widget:UIButton = this.getWidgetByName(name);
            if(widget){
                widget.setButtonImg(frameName);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 通过名字为Widget设置信息。
         * @param name
         * @param option
         */
        setInfoByName : function(name:string, option:any){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.setOption.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 通过名字设置widget颜色, widget通常是个Label。
         * @param name
         * @param color
         */
        setColorByName : function(name:string, color){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.setColor.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 通过名字设置Widget是否可点击
         * @param name
         * @param touchEnabled
         */
        setTouchEnabledByName : function(name:string, touchEnabled:boolean){
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.touchEnabled = touchEnabled;
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 通过名称设置click监听
         * @param name
         * @param listener
         * @param target
         * @param data
         * @param audioId
         */
        onClickByName : function(name:string, listener:Function, target?:any, data?:any, audioId?:any){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                if(target == null) args.push(this);
                widget.onClick.apply(widget, args);
                widget.soundOnClick(audioId);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 通过名称设置longTouch监听
         * @param name
         * @param listener
         * @param target
         */
        onLongTouchByName : function(name:string, listener:Function, target?:any){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.onLongTouch.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },
        /**
         * 设置是否打开长按事件的支持
         * @param name
         * @param listener
         * @param target
         */
        enableLongTouchByName : function(name:string, respInterval?:number, startInterVal?:number){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.enableLongTouch.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        setInfo : function(info){
            for (var name in info) {
                this.setInfoByName(name, info[name]);
            }
        },

        /**
         * 添加一个子节点。子节点可以是一个widget也可以是一个普通的node。在内部进行自动判断了。
         * @param name
         * @param child
         * @param tag
         */
        addChildNodeByName : function(name:string, child, tag){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.addChild.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 根据名字设置其是否可见。与visible不同的是，会同时设置是否可点击。
         * @param name
         * @param disappeared
         */
        setDisappearedByName : function(name:string, disappeared){
            this.setVisibleByName(name, !disappeared);
            this.setTouchEnabledByName(name, !disappeared);
        },

        /**
         * 根据名字设置动态图片
         * @param name
         * @param img
         * @param defImg
         */
        setDynamicImgByName : function(name:string, img:any, defImg?:any){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIImage = this.getWidgetByName(name);
            if(widget){
                widget.setDynamicImg.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        setMaskEnabledByName: function(name:string, enable){
            var self:any = this;
            var img:UIImage = self.getWidgetByName(name);
            if(img instanceof UIImage){
                img.setMaskEnabled(enable);
            }else{
                logger.warn("[%s] is not a ccs.ImageView", name);
            }
        },

        loadMaskTextureByName: function(name:string, textFileName:any){
            var self:any = this;
            var img:UIImage = self.getWidgetByName(name);
            if(img instanceof UIImage){
                var args = Array.prototype.slice.apply(arguments, [1]);
                img.loadMaskTexture.apply(img, args);
            }else{
                logger.warn("[%s] is not a ccs.ImageView", name);
            }
        },

        formatByName : function(name:string, ...args:any[]){
            var widget:UIText = this.getWidgetByName(name);
            if(widget){
                widget.format.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        doLayoutByName : function(name:string, ...args:any[]){
            var widget:UIPanel = this.getWidgetByName(name);
            if(widget){
                widget.doLayout.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        setLayoutDirtyByName : function(name:string, ...args:any[]){
            var widget:UIPanel = this.getWidgetByName(name);
            if(widget){
                widget.setLayoutDirty.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 根据widget的名称设置描边。
         * @param name
         * @param strokeColor
         * @param strokeSize
         * @param mustUpdateTexture
         * @returns {*}
         */
        enableStrokeByName : function(name:string, strokeColor:number, strokeSize:number){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIText = this.getWidgetByName(name);
            if(widget){
                widget.enableStroke.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 根据widget名字禁用描边。
         * @param name
         * @returns {*}
         */
        disableStrokeByName : function(name:string){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIText = this.getWidgetByName(name);
            if(widget){
                widget.disableStroke.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        _invocations : null,
        /**
         * 根据widget名字设置计时器。
         * 其中，widget必须为Label类型（有setText方法）。
         * 每次调用该方法，都为将起始时间设置为00:00。
         * @param name
         * @param {Function|null} cb  每秒的触发回调，可以不设置。参数为：millisecond(每次间隔的毫秒数，约等于1秒)； widget
         * @param {Function|null} target 回调函数的上下文，可以不设置
         * @returns {*}
         */
        setIntervalByName : function(name:string, cb, target):mo.Invocation{
            var widget:UIText = this.getWidgetByName(name);
            if(widget){
                (<any>widget)._passedMillisecond = 0;//强制赋值
                widget.setText("00:00");
                var inv:mo.Invocation = mo.timer.setInterval(function(millisecond){//距离上次调用时间间隔（毫秒）
                    this._passedMillisecond += millisecond;
                    this.setText(mo.getTimeStr(this._passedMillisecond));
                    if(cb) cb.call(target, millisecond, this);
                }, widget);
                this._invocations = this._invocations || [];
                this._invocations.push(inv);
                return inv;
            }else{
                logger.warn(mo_code.c_104, name);
                return null;
            }
        },

        /**
         * 设置倒计时类型触发器。
         * 当参数个数为四个时，表示：name, millisecond, endCallback, endTarget。
         * @param {String} name widget的名称
         * @param {Number} millisecond   倒计时的毫秒数
         * @param {Function|null} callback   每秒的回调
         * @param {Object|null} target       每秒的回调函数的上下文
         * @param {Function|null} endCallback   倒计时结束的回调
         * @param {Object|null} endTarget       倒计时结束的回调函数的上下文
         * @returns {CountdownInvocation}
         */
        countdownByName : function(name:string, millisecond, callback, target?:any, endCallback?:any, endTarget?:any):mo.Invocation{
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                if(arguments.length == 4 || arguments.length == 3){
                    endCallback = callback;
                    endTarget = target;
                    callback = null;
                    target = null;
                }
                var inv:mo.Invocation = mo.timer.countdown(millisecond, function(leftMillisecond){//距离上次调用时间间隔（毫秒）
                    this.setText(mo.getTimeStr(leftMillisecond));
                    if(callback) callback.call(target, leftMillisecond, this);
                }, widget, endCallback, endTarget);
                this._invocations = this._invocations || [];
                this._invocations.push(inv);
                return inv;
            }else{
                logger.warn(mo_code.c_104, name);
                return null;
            }
        },
        /**
         * 倒计时到某个时间点的触发器。
         * 当参数个数为四个时，表示：name, millisecond, endCallback, endTarget。
         * @param {String} name widget的名称
         * @param {Date|Number} endTime 结束的时间点。如果是Number类型，则表示时间戳。
         * @param {Function|null} callback   每秒的回调
         * @param {Object|null} target       每秒的回调函数的上下文
         * @param {Function|null} endCallback   倒计时结束的回调
         * @param {Object|null} endTarget       倒计时结束的回调函数的上下文
         * @returns {CountdownInvocation}
         */
        countdownToEndTimeByName : function(name:string, endTime, callback, target, endCallback?, endTarget?):mo.Invocation{
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                if(arguments.length == 4 || arguments.length == 3){
                    endCallback = callback;
                    endTarget = target;
                    callback = null;
                    target = null;
                }
                var inv:mo.Invocation = mo.timer.countdownToEndTime(endTime, function(leftMillisecond){//距离上次调用时间间隔（毫秒）
                    this.setText(mo.getTimeStr(leftMillisecond));
                    if(callback) callback.call(target, leftMillisecond, this);
                }, widget, endCallback, endTarget);
                this._invocations = this._invocations || [];
                this._invocations.push(inv);
                return inv;
            }else{
                logger.warn(mo_code.c_104, name);
                return null;
            }
        },

        /**
         * 循环方式的倒数计时。自动根据结束时间点算出循环次数。
         * @param {String} name widget的名称
         * @param {Date|Number} endTime 结束的时间点。如果是Number类型，则表示时间戳。
         * @param {Number} interval  每次循环的时间间隔
         * @param {Function|null} callback   每秒的回调
         * @param {Object|null} target       每秒的回调函数的上下文
         * @param {Function|null} intervalCallback  每次循环结束的回调
         * @param {Object|null} intervalTarget  每次循环结束的回调函数的上下文
         * @param {Function|null} endCallback   总倒计时结束的回调
         * @param {Object|null} endTarget   总倒计时结束的回调函数的上下文
         * @returns {LoopCountdownToEndTimeInvocation}
         */
        countdownLoopToEndTimeByName : function(name:string, endTime, interval, callback, target, intervalCallback, intervalTarget, endCallback, endTarget):mo.Invocation{
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                if(arguments.length == 7 || arguments.length == 6){
                    endCallback = intervalCallback;
                    endTarget = intervalTarget;
                    intervalCallback = callback;
                    intervalTarget = target;
                    callback = null;
                    target = null;
                }
                var inv:mo.Invocation = mo.timer.countdownLoopToEndTime(endTime, interval, function(leftMillisecond){//距离上次调用时间间隔（毫秒）
                    this.setText(mo.getTimeStr(leftMillisecond));
                    if(callback) callback.call(target, leftMillisecond, this);
                }, widget, intervalCallback, intervalTarget, endCallback, endTarget);
                this._invocations = this._invocations || [];
                this._invocations.push(inv);
                return inv;
            }else{
                logger.warn(mo_code.c_104, name);
                return null;
            }
        },

        /**
         * 设置线性布局（水平）。
         * @param name
         * @param spacing   间距
         * @returns {*}
         */
        setLinearLayoutByName : function(name:string, spacing, align){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIPanel = this.getWidgetByName(name);
            if(widget){
                widget.setLinearLayout.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 长按name1的widget显示name2的widget。
         * @param name1
         * @param name2
         * @returns {*}
         */
        setTouchToShowByName : function(name1, name2){
            var self:any = this;
            var widget1 = self.getWidgetByName(name1);
            if(!widget1) return logger.warn(mo_code.c_104, name1);

            var widget2 = self.getWidgetByName(name2);
            if(widget2){
                widget2.setVisible(false);
                var TE = mo_evt.TouchEvent;
                widget1.removeEventListener(TE.NODE_BEGIN, self._onBegin4TouchToShowByName, widget1);
                widget1.removeEventListener(TE.NODE_END, self._onEnd4TouchToShowByName, widget1);
                widget1["_targetNodeWhenTouchToShow"] = widget2;
                widget1.addEventListener(TE.NODE_BEGIN, self._onBegin4TouchToShowByName, widget1);
                widget1.addEventListener(TE.NODE_END, self._onEnd4TouchToShowByName, widget1);
            }else{
                logger.warn(mo_code.c_104, name2);
            }
        },

        //TODO
        _onBegin4TouchToShowByName:function(){
            this["_targetNodeWhenTouchToShow"].visible = true;
        },
        _onEnd4TouchToShowByName:function(){
            this["_targetNodeWhenTouchToShow"].visible = false;
        },

        /**
         * 底数，例如： [100,200,300]
         * @param {Array} arr
         */
        setProgressQueueBaseNumberByName : function(name:string, arr){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UILoadingBar = this.getWidgetByName(name);
            if(widget){
                widget.setProgressQueueBaseNumber.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**\
         * 单次增加多少
         * @param name
         * @param value
         * @param cb
         * @param ctx
         * @returns {*}
         */
        runProgressQueueByName : function(name:string, value:number, cb:Function, ctx?:any){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UILoadingBar = this.getWidgetByName(name);
            if(widget){
                widget.runProgressQueue.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 通过名称获得widget并执行动作。
         * @param name
         * @param action
         */
        runActionByName : function(name:string, action){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.runAction.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 添加事件监听
         * @param name widget名
         * @param eventName 事件名
         * @param cb
         * @param cbtx
         */
        addEventListenerByName: function(name:string, eventName:string, cb:Function, cbtx:any){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.addEventListener.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        },

        /**
         * 移除事件监听
         * @param name
         * @param eventName
         * @param cb
         * @param cbtx
         */
        removeEventListenerByName: function(name:string, eventName:string, cb:Function, cbtx:any){
            var args = Array.prototype.slice.apply(arguments, [1]);
            var widget:UIWidget = this.getWidgetByName(name);
            if(widget){
                widget.removeEventListener.apply(widget, args);
            }else{
                logger.warn(mo_code.c_104, name);
            }
        }
    };
}