module mo_evt {
    export class TouchEvent extends egret.TouchEvent {

        static LONG_TOUCH_BEGIN:string = "longTouchBegin";//长按开始
        static LONG_TOUCH_END:string = "longTouchEnd";//长按结束

        static NODE_BEGIN:string = "nodeBegin";
        static NODE_END:string = "nodeEnd";
        static NODE_MOVE:string = "nodeMove";

        //@override
        public static dispatchTouchEvent(target:egret.IEventDispatcher,type:string,touchPointID:number = 0, stageX:number = 0, stageY:number = 0,
                                         ctrlKey:boolean=false,altKey:boolean=false,shiftKey:boolean=false,touchDown:boolean=false):void{
            var eventClass:any = TouchEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.touchPointID = touchPointID;
            props._stageX = stageX;
            props._stageY = stageY;
            props.ctrlKey = ctrlKey;
            props.altKey = altKey;
            props.shiftKey = shiftKey;
            props.touchDown = touchDown;
            Event._dispatchByTarget(eventClass, target, type, props, true, true);
        }
    }
}