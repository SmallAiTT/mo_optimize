module mo_ui{
    export interface IWidgetByNameApi{
        getPositionByName(name:string):mo.Point;
        setPositionByName(name:string, x:any, y?:number):void;
        setPositionOffsetByName(name:string, x:any, y?:number):void;
        setScaleByName(name:string, scaleX:any, scaleY?:number):void;
        /**
         * 缩放适配屏幕
         * @param widgetName
         * @param mode
         */
        setAdaptiveScaleByName(widgetName:string, mode):void;
        setSizeByName(name:string, width:any, height?:number):void;
        getSizeByName(name:string):mo.Size;
        setVisibleByName(name:string, visible):void;
        setGrayByName(name:string, isGray:boolean):void;
        setButtonImgByName(name:string, frameName:string):void;
        /**
         * 通过名字为Widget设置信息。
         * @param name
         * @param option
         */
        setInfoByName(name:string, option:any):void;
        setInfo(info:any):void;
        /**
         * 通过名字设置widget颜色, widget通常是个Label。
         * @param name
         * @param color
         */
        setColorByName(name:string, color:number):void;
        /**
         * 通过名字设置Widget是否可点击
         * @param name
         * @param touchEnabled
         */
        setTouchEnabledByName(name:string, touchEnabled:boolean):void;
        /**
         * 通过名称设置click监听
         * @param name
         * @param listener
         * @param target
         * @param data
         * @param audioId
         */
        onClickByName(name:string, listener:Function, target?:any, data?:any, audioId?:any):void;
        /**
         * 通过名称设置longTouch监听
         * @param name
         * @param listener
         * @param target
         */
        onLongTouchByName(name:string, listener:Function, target?:any, respInterval?:number, startInterVal?:number):void;
        /**
         * 打开长按事件的支持
         * @param name
         * @param listener
         * @param target
         * @param respInterval
         * @param startInterVal
         */
        enableLongTouchByName(name:string, respInterval?:number, startInterVal?:number):void;
        /**
         * 添加一个子节点。子节点可以是一个widget也可以是一个普通的node。在内部进行自动判断了。
         * @param name
         * @param child
         * @param tag
         */
        addChildNodeByName(name:string, child, tag):void;
        /**
         * 根据名字设置其是否可见。与visible不同的是，会同时设置是否可点击。
         * @param name
         * @param disappeared
         */
        setDisappearedByName(name:string, disappeared):void;
        /**
         * 根据名字设置动态图片
         * @param name
         * @param img
         * @param defImg
         */
        setDynamicImgByName(name:string, img:any, defImg?:any):void;
        setMaskEnabledByName(name:string, enable):void;
        loadMaskTextureByName(name:string, textFileName:any):void;
        formatByName(name:string, ...args:any[]):void;
        doLayoutByName(name:string, ...args:any[]):void;
        setLayoutDirtyByName(name:string, ...args:any[]):void;

        /**
         * 根据widget的名称设置描边。
         * @param name
         * @param strokeColor
         * @param strokeSize
         * @returns {*}
         */
        enableStrokeByName(name:string, strokeColor:number, strokeSize:number):void;
        /**
         * 根据widget名字禁用描边。
         * @param name
         * @returns {*}
         */
        disableStrokeByName(name):void;
        _invocations : any[];
        /**
         * 根据widget名字设置计时器。
         * 其中，widget必须为Label类型（有setText方法）。
         * 每次调用该方法，都为将起始时间设置为00:00。
         * @param name
         * @param {Function|null} cb  每秒的触发回调，可以不设置。参数为：millisecond(每次间隔的毫秒数，约等于1秒)； widget
         * @param {Function|null} target 回调函数的上下文，可以不设置
         * @returns {*}
         */
        setIntervalByName(name:string, cb, target):any;
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
        countdownByName(name:string, millisecond, callback, target?:any, endCallback?:any, endTarget?:any):any;
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
        countdownToEndTimeByName(name:string, endTime, callback, target, endCallback?, endTarget?):any;
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
        countdownLoopToEndTimeByName(name:string, endTime, interval, callback, target, intervalCallback, intervalTarget, endCallback, endTarget):any;
        /**
         * 设置线性布局（水平）。
         * @param name
         * @param spacing   间距
         * @returns {*}
         */
        setLinearLayoutByName(name:string, spacing, align):void;
        /**
         * 长按name1的widget显示name2的widget。
         * @param name1
         * @param name2
         * @returns {*}
         */
        setTouchToShowByName(name1, name2):void;
        /**
         * 底数，例如： [100,200,300]
         * @param {Array} arr
         */
        setProgressQueueBaseNumberByName(name:string, arr):void;
        /**\
         * 单次增加多少
         * @param name
         * @param value
         * @param cb
         * @param ctx
         * @returns {*}
         */
        runProgressQueueByName(name:string, value:number, cb:Function, ctx?:any):void;
        /**
         * 通过名称获得widget并执行动作。
         * @param name
         * @param action
         */
        runActionByName(name:string, action):void;

        /**
         * 添加事件监听
         * @param name widget名
         * @param eventName 事件名
         * @param cb
         * @param cbtx
         */
        addEventListenerByName(name:string, eventName:string, cb:Function, cbtx:any):void;
        /**
         * 移除事件监听
         * @param name
         * @param eventName
         * @param cb
         * @param cbtx
         */
        removeEventListenerByName(name:string, eventName:string, cb:Function, cbtx:any):void;
    }
}