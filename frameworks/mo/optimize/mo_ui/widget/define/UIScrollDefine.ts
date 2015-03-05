module mo_ui.ScrollViewDir{
    export var none: number = 0;
    export var vertical: number = 1;
    export var horizontal: number = 2;
    export var both: number = 3;
}
module mo_ui.ScrollViewEventType{
    export var scrollToTop: number = 0;
    export var scrollToBottom: number = 1;
    export var scrollToLeft: number = 2;
    export var scrollToRight: number = 3;
    export var scrolling: number = 4;
    export var bounceTop: number = 5;
    export var bounceBottom: number = 6;
    export var bounceLeft: number = 7;
    export var bounceRight: number = 8;
}
module mo_ui{
    export var AUTOSCROLLMAXSPEED: number = 1000;
    export var SCROLLDIR_UP: mo.Point = mo.p(0, 1);
    export var SCROLLDIR_DOWN: mo.Point = mo.p(0, -1);
    export var SCROLLDIR_LEFT: mo.Point = mo.p(-1, 0);
    export var SCROLLDIR_RIGHT: mo.Point = mo.p(1, 0);
}
module mo_opt{

    export class _ScrollOption extends Option{
        innerContainer: mo_ui.UIPanel;//内部对象容器
        direction:number;//方向，见mo.ScrollViewDir
        scrollDir:mo.Point;//移动时的方向
        autoScrollDir:mo.Point;
        topBoundary:number;//test
        bottomBoundary:number;//test
        leftBoundary:number;
        rightBoundary:number;
        bounceTopBoundary:number;
        bounceBottomBoundary:number;
        bounceLeftBoundary:number;
        bounceRightBoundary:number;
        autoScroll:boolean;
        autoScrollAddUpTime:number;
        autoScrollOriginalSpeed:number;
        autoScrollAcceleration:number;
        isAutoScrollSpeedAttenuated;
        needCheckAutoScrollDestination;
        autoScrollDestination:mo.Point;
        slidTime:number;
        moveChildPoint:mo.Point;
        childFocusCancelOffset:number;
        leftBounceNeeded:boolean;
        topBounceNeeded:boolean;
        rightBounceNeeded:boolean;
        bottomBounceNeeded:boolean;
        bounceEnabled:boolean;
        bouncing:boolean;
        bounceDir:mo.Point = mo.p(0, 0);
        bounceOriginalSpeed:number;
        inertiaScrollEnabled:boolean;
        scrollViewEventListener:Function;
        scrollViewEventSelector:any;
        targetNode:mo.Node;
        longTouchWhenScrollingEnabled:boolean;//当scrollView滚动的时候是否还要相应子节点长按
        maxMovedDeltaSQ:number;//移动距离上限
        scrollEnabled:boolean;
        //@override
        _initProp():void{
            super._initProp();
            var self = this;

            self.innerContainer = new mo_ui.UIPanel();
            self.innerContainer.setName("innerContainer");
            self.innerContainer.touchEnabled = false;//设置成不可点击
            self.direction = mo_ui.ScrollViewDir.both;
            self.scrollDir = mo.p(0, 0);
            self.autoScrollDir = mo.p(0, 0);
            self.topBoundary = 0;//test
            self.bottomBoundary = 0;//test
            self.leftBoundary = 0;
            self.rightBoundary = 0;
            self.bounceTopBoundary = 0;
            self.bounceBottomBoundary = 0;
            self.bounceLeftBoundary = 0;
            self.bounceRightBoundary = 0;
            self.autoScroll = false;
            self.autoScrollAddUpTime = 0;
            self.autoScrollOriginalSpeed = 0;
            self.autoScrollAcceleration = -1000;
            self.isAutoScrollSpeedAttenuated = false;
            self.needCheckAutoScrollDestination = false;
            self.autoScrollDestination = mo.p(0, 0);
            self.slidTime = 0;
            self.moveChildPoint = mo.p(0, 0);
            self.childFocusCancelOffset = 5;
            self.leftBounceNeeded = false;
            self.topBounceNeeded = false;
            self.rightBounceNeeded = false;
            self.bottomBounceNeeded = false;
            self.bounceEnabled = false;
            self.bouncing = false;
            self.bounceDir = mo.p(0, 0);
            self.bounceOriginalSpeed = 0;
            self.inertiaScrollEnabled = true;
            self.scrollViewEventListener = null;
            self.scrollViewEventSelector = null;
            self.longTouchWhenScrollingEnabled = false;
            self.maxMovedDeltaSQ = 100;
            self.scrollEnabled = true;
        }

        dtor(){
            super.dtor();
            var self = this;
            self.scrollViewEventListener = null;
            self.scrollViewEventSelector = null;
        }
    }
}