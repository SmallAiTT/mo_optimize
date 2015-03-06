/**
 * Created by SmallAiTT on 2015/3/6.
 */
module mo_utils.consts{
    export var WAITING_LAYER_TYPE_NORMAL:number = 1;
    export var WAITING_LAYER_TYPE_RECONNECT:number = 2;
}
module mo_utils{

    var _waitingPlayCount = 0;
    var _WaitingLayerMap;
    export function addWaitingLayer(waitingLayerType, WaitingLayerClass:any){
        _WaitingLayerMap[waitingLayerType] = WaitingLayerClass;
    }
    /**
     * 播放等待画面
     */
    export function playWaiting(){
        if(_waitingPlayCount > 0) return;//已经显示了
        _waitingPlayCount++;
        process.nextTick(function(){
            _WaitingLayerMap[consts.WAITING_LAYER_TYPE_NORMAL].getInstance().show();
        })
    }
    /**
     * 停止等待画面
     */
    export function stopWaiting(){
        _waitingPlayCount--;
        if(_waitingPlayCount > 0) return;//还在显示
        if(_waitingPlayCount < 0) {
            _waitingPlayCount = 0;
            return;
        }
        _WaitingLayerMap[consts.WAITING_LAYER_TYPE_NORMAL].getInstance().close();
    }

    /**
     * 强制停止等待画面
     */
    export function stopWaitingForce(){
        _WaitingLayerMap[consts.WAITING_LAYER_TYPE_NORMAL].getInstance().close();
        _waitingPlayCount = 0;
    }

    /**
     * 播放断线重连画面
     */
    export function playReconnectWaiting():void{
        _WaitingLayerMap[consts.WAITING_LAYER_TYPE_RECONNECT].getInstance().show();
    }

    /**
     * 停止断线重连画面
     */
    export function stopReconnectWaiting():void{
        _WaitingLayerMap[consts.WAITING_LAYER_TYPE_RECONNECT].getInstance().close();
    }
}