
module mo{
    
    export class NetEvent extends mo_evt.Event{
        public route_value:any;
        public route_msgCode:string;
        public route_msgArgs:any;
    }

    export class Net extends mo_evt.EventDispatcher{
        static __className:string = "Net";

        static ON_ERROR:string = "error";
        static ON_CLOSE:string = "close";
        static ON_SUCCESS:string = "success";
        static ON_ROUTE_ERROR:string = "resultError";
        static ON_ROUTE_SUCCESS:string = "resultSuccess";


        logServer:boolean;//boolean TODO 需要在外部设置
        respKey_msgCode:string;//string
        respKey_msgArgs:string;//string
        respKey_value:string;//string

        httpKey_route:string;
        httpKey_args:any;
        httpKey_handler:any;


        key_host:string;//string TODO 需要在外部设置
        key_port:string;//string TODO 需要在外部设置
        gateDispatcher:string;//string TODO


        httpHost:string;//string TODO 这个需要在外部设置
        httpPort:string;//string TODO 这个需要在外部设置


        loginNameKey:string;//string TODO 需要在外部设置
        loginPwdKey:string;//string TODO 需要在外部设置
        loginNameKeyOfLocal:string;//string TODO 需要在外部设置
        loginPwdKeyOfLocal:string;//string TODO 需要在外部设置
        loginRoute:string;//string TODO 需要在外部设置


        _connectEventsInited:boolean;
        _connected:boolean;

        //@override
        _initProp(){
            super._initProp();
        }

        _initConnectEvents(){
            var self = this;
            if (self._connectEventsInited) return;//如果已经初始化过了，就直接返回
            //----------------------------监听消息--------------------------
            self._connectEventsInited = true;
            pomelo.on("io-error", function(event){
                self._onIOError(event);
            });
            //POMELO_ON_KEY_SYSMSG
            pomelo.on("a", function (data) {
                logger.debug(data);
            });
            pomelo.on("close", function(event){
                logger.log("链接断开!");
                self._onClose2(event);
            });//重新注册连接的监听
            pomelo.on("onKick", function(event){
                logger.log("被踢出!");
                self._onClose2(event);
            });
        }

        _onIOError(event:any){
            mo_utils.stopWaiting();
            var newEvent = new mo.NetEvent(this.__class.ON_ERROR);
            this.dispatchEvent(newEvent);
        }

        _onClose1(event:any){
            mo_utils.stopWaiting();
            pomelo.removeAllListeners("close");
        }

        _onClose2(event:any){
            mo_utils.stopWaiting();
            this._connected = false;
            var newEvent = new mo.NetEvent(this.__class.ON_CLOSE);
            this.dispatchEvent(newEvent);
        }

        public connect(cb:Function){
            var self = this;
            mo_utils.playReconnectWaiting();//先播放重连的等待

            self.request(self.gateDispatcher, {}, function (result) {//TODO
                var host = result[self.key_host];
                var port = result[self.key_port];
                self._initConnectEvents();
                //重新请求
                pomelo.init({
                    host: host,
                    port: port,
                    log: self.logServer,
//                reconnect:true,
                    maxReconnectAttempts: 20
                }, function () {
                    self._connected = true;
                    mo_utils.stopReconnectWaiting();
                    cb();
                });
            }, this);
        }

        _getRequestArgs(iface, args, cb, target, option){
            var l = arguments.length;
            if (l < 2 || l > 6) throw "Arguments error for request!";
            var locArgs, locCb, locOption;
            for (var i = 1; i < l; i++) {
                var arg = arguments[i];
                if ((typeof arg == "object" || arg == null) && !locCb) locArgs = arg;
                else if (typeof arg == "function" && !locCb)locCb = arg;
                else if ((typeof arg == "object" || arg == null) && locCb && !locOption) locOption = {target: arg};
                else if (locOption) {
                    arg.target = locOption.target;
                    locOption = arg;
                }
                else throw "Arguments error for request!";
            }
            locOption = locOption || {};
            locOption.cb = locCb;
            return [iface, locArgs, locOption.cb, locOption.target];//TODO 今后要做改造
        }

        _isRequestHttp(route){//子类可以重写该接口进行判断是否是一个http请求
            return route.split(".")[0] == this.httpKey_handler;//TODO
        }

        _getHttpParams(route, args){
            var self = this;
            var params = "/?";
            params += self.httpKey_route + "=" + route;//TODO
            params += "&" + self.httpKey_args + "=" + JSON.stringify(args || {});//TODO
            return params;
        }
        _requestHttp(route:string, args:any, cb:Function, ctx?:any, needToStopWaiting?:boolean){
            var self = this;
            var httpUrl = "http://" + self.httpHost + ":" + self.httpPort;
            var params = self._getHttpParams(route, args);

            //先这么实现下，以后会继续优化
            var urlLoader = new egret.net.URLLoader();
            var urlRequest = new egret.net.URLRequest(httpUrl + params);
            urlLoader.dataFormat = egret.net.URLLoaderDataFormat.TEXT;
            urlLoader.load(urlRequest);
            urlLoader.addEventListener(egret.evt.Event.COMPLETE, function(event){
                if(needToStopWaiting) mo_utils.stopWaiting();
                logger.debug(route, "--->", event.type, urlLoader.data);
                self._handlerRouteResult(route, JSON.parse(urlLoader.data), cb, ctx);
            }, null);
            urlLoader.addEventListener(egret.evt.IOErrorEvent.IO_ERROR, function(event){
                if(needToStopWaiting) mo_utils.stopWaiting();
                logger.debug(route, "--->", event.type, urlLoader.data);
                self._onClose2(event);
            }, null);
        }
        _requestPomelo(route, args, cb, ctx, needToStopWaiting){
            var self = this;
            pomelo.request(route, args || {}, function (result) {
                if(needToStopWaiting) mo_utils.stopWaiting();
                self._handlerRouteResult(route, result, cb, ctx);
            });
        }
        addEventListenerForRouteSuccess(route, cb, ctx){
            this.addEventListener(this.__class.ON_ROUTE_SUCCESS + "_" + route, cb, ctx);
        }
        removeEventListenerForRouteSuccess(route, cb, ctx){
            this.removeEventListener(this.__class.ON_ROUTE_SUCCESS + "_" + route, cb, ctx);
        }
        addEventListenerForRouteError(route, cb, ctx){
            this.addEventListener(this.__class.ON_ROUTE_ERROR + "_" + route, cb, ctx);
        }
        removeEventListenerForRouteError(route, cb, ctx){
            this.removeEventListener(this.__class.ON_ROUTE_ERROR + "_" + route, cb, ctx);
        }
        _handlerRouteResult(route, result, cb, ctx){
            var self = this;
            var msgCode = result[self.respKey_msgCode];

            if (msgCode == null) {//服务器处理成功
                if(cb) cb.call(ctx, result[self.respKey_value]);
                var event = new mo.NetEvent(this.__class.ON_ROUTE_SUCCESS + "_" + route);
                event.route_value = result[self.respKey_value];
                this.dispatchEvent(event);
            } else {//服务器处理失败
                //显示错误消息
                var msgArgs = result[self.respKey_msgArgs];
                var tempArr = msgArgs || [];
                tempArr.splice(0, 0, msgCode);
                logger.showMsg.apply(mo, tempArr);

                var eventType = this.__class.ON_ROUTE_ERROR + "_" + route;
                if(this.willTrigger(eventType)){
                    var event = new mo.NetEvent(eventType);
                    event.route_msgCode = msgCode;
                    event.route_msgArgs = msgArgs;
                    this.dispatchEvent(event);
                }
            }
        }
        _request(route, args, cb, ctx, needToStopWaiting){
            var self = this;
            if (self._isRequestHttp(route)) {
                self._requestHttp(route, args, cb, ctx, needToStopWaiting);
            } else {
                if (self._connected)//如果已经连接则直接访问
                    self._requestPomelo(route, args, cb, ctx, needToStopWaiting);
                else//否则先进行重连
                    self._reconnect(function () {
                        self._requestPomelo(route, args, cb, ctx, needToStopWaiting);
                    });
            }
        }
        _reconnect(cb){
            var self = this;
            self.connect(function () {
                var args = {};
                args[self.loginNameKey] = mo_base.setLocalStorageItem(self.loginNameKeyOfLocal, true);
                args[self.loginPwdKey] = mo_base.setLocalStorageItem(self.loginPwdKeyOfLocal, true);
                pomelo.request(self.loginRoute, args, function () {
                    cb.apply(null, arguments);
                });
            });
        }

        request(route, args, cb, ctx){
            var params = this._getRequestArgs.apply(this, arguments);
            this._request(params[0], params[1], params[2], params[3], false);
        }

        requestWaiting(route, args, cb, ctx){
            mo_utils.playWaiting();
            var params = this._getRequestArgs.apply(this, arguments);
            this._request(params[0], params[1], params[2], params[3], true);
        }

        disconnect(){
            pomelo.disconnect();
        }
    }

}