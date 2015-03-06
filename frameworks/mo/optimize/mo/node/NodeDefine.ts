/**
 * Created by SmallAiTT on 2015/3/4.
 */
module mo_opt{

    export class Option extends mo_base.Class{
        public static __className:string = "Option";

        reset(){}
        clone(temp:Option):Option{
            var self = this;
            temp = temp || new self.__class();
            return temp;
        }

    }

    export class _NodeOption extends Option{
        tag:string;
        nodeSizeDirty:boolean;//起这个名字是因为egret已经把_sizeDirty设置成了private的了，没法继承
        clickData:any;
        zOrder:number;
        tempRect:mo.Rect;
        penetrable:boolean;//是否可穿透，默认为不可穿透
        clickCb:Function;//(sender:Node, event:egret.TouchEvent)=>void;
        clickCtx:any;
        factory:any;
        delegate:any;
        canBeReclaimed:boolean;
        eventStoreForClass:any;//DataController类的事件注册存储
        isReclaimed:boolean;
        isAutoDtor:boolean;//是否自动dtor，默认为ture

        hasDtored:boolean;

        scale9Grid:mo.Rect;
        scale9Enabled:boolean;
        fillMode:string;

        //@override
        _initProp():void{
            super._initProp();
            var self = this;
            self.tag = null;
            self.nodeSizeDirty = true;//起这个名字是因为egret已经把_sizeDirty设置成了private的了，没法继承
            self.clickData = null;
            self.zOrder = 0;
            //作为自身身体一部分的子节点映射，key为hashCode
            self.tempRect = mo.rect(0, 0, 0, 0);
            self.penetrable = false;//是否可穿透，默认为不可穿透
            self.clickCb = null;
            self.clickCtx = null;
            self.factory = null;
            self.delegate = null;
            self.canBeReclaimed = false;
            self.eventStoreForClass = {};//DataController类的事件注册存储
            self.isReclaimed = false;
            self.isAutoDtor = true;//是否自动dtor，默认为ture
            self.hasDtored = false;

            self.scale9Grid = mo.rect(0, 0, 0, 0);
            self.scale9Enabled = false;
            self.fillMode = egret.consts.BitmapFillMode.SCALE;
        }

        dtor(){
            super.dtor();
            var self = this;
            self.clickCb = null;
            self.clickCtx = null;
            self.factory = null;
            self.delegate = null;
            self.clickData = null;
        }
    }

    export class _TouchOption extends Option{
        touchBeganPoint:mo.Point;
        touchBeganStagePoint:mo.Point;
        touchMovedPoint:mo.Point;
        touchMovedStagePoint:mo.Point;
        touchMovingPoint:mo.Point;
        touchMovingStagePoint:mo.Point;
        touchEndedPoint:mo.Point;
        touchEndedStagePoint:mo.Point;


        bePressed:boolean;
        canTap:boolean;
        canLongTouch:boolean;
        touchEventsInited:boolean;
        longTouchEventSelector:Function;
        longTouchEventListener:any;
        isDoingLongEvent:boolean;
        respInterval:number;
        startInterVal:number;
        longTouchEnabled:boolean;
        longTouchEventInterValId:number;
        longTouchTimeoutId:number;
        movedDeltaSQ:number;//点在local内移动距离的平方
        isIn:boolean;//是否在点击区域内
        hitChildrenEnabled:boolean;
        hitEgretEnabled:boolean;//是否开启Node中，egret的自身节点可点击，默认关闭，也就是说知道Node这层，用于提高性能

        //@override
        _initProp():void{
            super._initProp();
            var self = this;
            self.touchBeganPoint = mo.p(0, 0);
            self.touchBeganStagePoint = mo.p(0, 0);
            self.touchMovedPoint = mo.p(0, 0);
            self.touchMovedStagePoint = mo.p(0, 0);
            self.touchMovingPoint = mo.p(0, 0);
            self.touchMovingStagePoint = mo.p(0, 0);
            self.touchEndedPoint = mo.p(0, 0);
            self.touchEndedStagePoint = mo.p(0, 0);

            self.bePressed = false;
            self.canTap = false;
            self.touchEventsInited = false;
            self.longTouchEventSelector = null;
            self.longTouchEventListener = null;
            self.isDoingLongEvent = false;
            self.respInterval = 100;
            self.startInterVal = 400;
            self.longTouchEnabled = false;
            self.longTouchEventInterValId = null;
            self.longTouchTimeoutId = null;
            self.movedDeltaSQ = 0;//点在local内移动距离的平方
            self.hitChildrenEnabled = true;
            self.hitEgretEnabled = false;
        }

        dtor(){
            super.dtor();
            this._initProp();
            var self = this;
            self.longTouchEventSelector = null;
            self.longTouchEventListener = null;
            self.longTouchEventInterValId = null;
            self.longTouchTimeoutId = null;
        }

        clearPoints(){
            var self = this;

            self.touchBeganPoint._setX(0);
            self.touchBeganPoint._setY(0);
            self.touchBeganStagePoint._setX(0);
            self.touchBeganStagePoint._setY(0);
            self.touchMovedPoint._setX(0);
            self.touchMovedPoint._setY(0);
            self.touchMovedStagePoint._setX(0);
            self.touchMovedStagePoint._setY(0);
            self.touchMovingPoint._setX(0);
            self.touchMovingPoint._setY(0);
            self.touchMovingStagePoint._setX(0);
            self.touchMovingStagePoint._setY(0);
            self.touchEndedPoint._setX(0);
            self.touchEndedPoint._setY(0);
            self.touchEndedStagePoint._setX(0);
            self.touchEndedStagePoint._setY(0);
        }

    }

    //拓展option，用于给对象加外部添加的拓展属性用，避免属性数量过大
    export class _ExtendOption extends Option{

    }
}