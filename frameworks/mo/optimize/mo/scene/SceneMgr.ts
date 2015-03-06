module mo {
    export var runningScene:any;

    export class SceneMgr extends mo_base.Class {
        static __className:string = "SceneMgr";

        static LOADING_TYPE_CIRCLE:number = 0;
        static LOADING_TYPE_ARMATURE:number = 1;

        _scenesStack:Array<Scene>;

        //@override
        _initProp() {
            super._initProp();
            var self = this;
            self._scenesStack = []; 
        }

        _LoadingLayerClass:any;
        registerLoadingLayerClass(LoadingLayerClass:any){
            this._LoadingLayerClass = LoadingLayerClass;
        }

        /**
         * 推送场景，还会保留原来的scene在内存里
         * @param sceneClass
         * @param loadingType
         * @param reqTask
         * @param cb
         */
        runScene(sceneClass:any, loadingType:number, reqTask:Function, cb?:Function) {
            var self = this, layer;
            if(!cb) {
                cb = reqTask;
                reqTask = function(cb1){
                    cb1(null);
                };
            }

            if(loadingType == SceneMgr.LOADING_TYPE_CIRCLE){
                mo_utils.playWaiting();
            }
            else{
                layer = self._LoadingLayerClass.create();
                layer.show();
            }
            res.mgr.runModule(sceneClass.__className);//资源模块推入
            reqTask(function(err) {
                if (err) {
                    res.mgr.popModule(sceneClass.__className);//资源模块推出
                    res.mgr.releaseModule();//进行释放
                    return;
                }

                var resArr = res.getResArr(sceneClass.__className);//获取资源列表
                res.load(resArr, function(){//进行资源加载
                    sceneClass.preload(function(err){
                        if (err) {
                            res.mgr.popModule(sceneClass.__className);//资源模块推出
                            res.mgr.releaseModule();//进行释放
                            return;
                        }
                        var preScene = runningScene;
                        var scene = sceneClass.create();//创建scene

                        var eventType = egret.Event.ADDED_TO_STAGE;
                        var releaseModuleFunc = function(){
                            scene.removeEventListener(eventType, releaseModuleFunc, self);//记得移除监听
                            res.mgr.releaseModule();
                        };
                        scene.addEventListener(eventType, releaseModuleFunc, self);//在新场景进入时进行释放

                        //添加新的scene视图可见的监听
                        mo_evt.dispatchEvent([[mo_evt.actionDispatcher, gEventType.newSceneVisible]], function(){
                            runningScene = scene;
                            var stage = clearStage();

                            if(preScene){//如果有，则需要出发所有这个scene下面的所有可见的layer的invisible监听
                                self._dispatchVisibleLayerInvisible(preScene);
                            }
                            //释放原来的Scene
                            if(preScene && !preScene._isInstance){
                                preScene.doDtor();
                            }

                            stage.addChildAt(scene, 0);
                            scene.show();
                            cb(null, scene);

                            if(loadingType == SceneMgr.LOADING_TYPE_CIRCLE){
                                mo_utils.stopWaiting();
                            }
                            else{
                                if(layer) layer.close();
                            }
                        }, self);
                    });
                });
            });
        }

        /**
         * 推送场景，还会保留原来的scene在内存里
         * @param sceneClass
         * @param loadingType
         * @param cb
         * @param reqTask
         */
        pushScene(sceneClass:any, loadingType:number, reqTask:Function, cb?:Function) {
            var self = this, layer;
            if(!cb) {
                cb = reqTask;
                reqTask = function(cb1){
                    cb1(null);
                };
            }
            if(loadingType == SceneMgr.LOADING_TYPE_CIRCLE){
                mo_utils.playWaiting();
            }
            else{
                layer = self._LoadingLayerClass.create();
                layer.show();
            }

            res.mgr.pushModule(sceneClass.__className);//资源模块推入
            reqTask(function(err, ...args){
                if(err) {
                    res.mgr.popModule(sceneClass.__className);//资源模块推出
                    res.mgr.releaseModule();//进行释放
                    return;
                }

                var resArr = res.getResArr(sceneClass.__className);//获取资源列表
                res.load(resArr, function(){//进行资源加载
                    sceneClass.preload(function(err){
                        if(err) {
                            res.mgr.popModule(sceneClass.__className);//资源模块推出
                            res.mgr.releaseModule();//进行释放
                            return;
                        }

                        var preScene = runningScene;
                        var scene = sceneClass.create.apply(sceneClass, args);//创建scene

                        if (preScene && self._scenesStack.indexOf(preScene) == -1) {//如果需要入栈
                            preScene.isAutoDtor = false;//设置成不自动释放
                            self._scenesStack.push(preScene);
                            //需要触发所有这个scene下面的所有可见的layer的invisible监听
                            self._dispatchVisibleLayerInvisible(preScene);
                        }

                        //添加新的scene视图可见的监听
                        mo_evt.dispatchEvent([[mo_evt.actionDispatcher, gEventType.newSceneVisible]], function(){
                            runningScene = scene;
                            var stage = clearStage();

                            stage.addChildAt(scene, 0);
                            scene.show();
                            cb(null, scene);

                            if(loadingType == SceneMgr.LOADING_TYPE_CIRCLE){
                                mo_utils.stopWaiting();
                            }
                            else{
                                if(layer) layer.close();
                            }
                        }, self);
                    });
                });
            });
        }

        /**
         * 回到上一个scene哦亲
         * @param sceneClass
         */
        popScene(sceneClass?:any) {
            res.mgr.popModule(mo.runningScene.__className);

            var self = this, scene, preScene;
            if(sceneClass){
                for (var i = self._scenesStack.length; i > 0; i--) {
                    scene = self._scenesStack.pop();
                    if(scene.__className != sceneClass.__className){
                        res.mgr.popModule(scene.__className);
                        //释放原来的Scene
                        if(!scene._isInstance){
                            scene.doDtor();
                        }
                    }
                    else{
                        preScene = scene;
                        break;
                    }
                }
            }
            else{
                preScene = self._scenesStack.pop();
            }

            if(preScene){
                var eventType = egret.Event.ADDED_TO_STAGE;
                var releaseModuleFunc = function(){
                    preScene.removeEventListener(eventType, releaseModuleFunc, self);//记得移除监听
                    res.mgr.releaseModule();
                };
                preScene.addEventListener(eventType, releaseModuleFunc, self);//在新场景进入时进行释放
            }

            //添加新的scene视图可见的监听
            mo_evt.dispatchEvent([[mo_evt.actionDispatcher, gEventType.newSceneVisible]], function(){
                var oldRunningScene = runningScene;
                runningScene = preScene;
                var stage = clearStage();
                //释放原来的Scene
                if(oldRunningScene && !oldRunningScene._isInstance){
                    oldRunningScene.doDtor();
                }
                if(preScene) {
                    stage.addChildAt(preScene, 0);
                    //这时候，还需要触发所有layer的visible监听
                    self._dispatchVisibleLayerVisible(preScene);
                }
            }, self);
        }

        _dispatchVisibleLayerVisible(parent:Node){//这里是通知原来可见的重新出发下可见的监听
            var children = parent.getChildren();
            for(var i = 0; i < children.length; ++i){
                var child = children[i];
                if(child && child.visible && child instanceof mo.Layer){
//                    if((<Layer>child).__className == "CopyLayer"){
//                        debugger;
//                    }
                    mo_evt.dispatchEvent([
                        [mo_evt.visibleDispatcher, (<Layer>child).__className],
                        [child, gEventType.visible]
                    ], (<Layer>child)._onShowReady, child);
                    this._dispatchVisibleLayerVisible(<Node>child);
                }
            }
        }
        _dispatchVisibleLayerInvisible(parent:Node){//这里是通知原来可见的触发不可见的监听
            var children = parent.getChildren();
            for(var i = 0; i < children.length; ++i){
                var child = children[i];
                if(child && child.visible && child instanceof mo.Layer){
                    mo_evt.dispatchEvent([
                        [mo_evt.invisibleDispatcher, (<Node>child).__className],
                        [child, gEventType.invisible]
                    ], function(){}, child);
                    this._dispatchVisibleLayerInvisible(<Node>child);
                }
            }
        }

        purge (){
            var self = this;
            self._scenesStack.length = 0;
            runningScene = null;
        }

        isInStack(scene:mo.Scene){
            return this._scenesStack.indexOf(scene) >= 0;
        }

    }

    export var sceneMgr = SceneMgr.create();
}