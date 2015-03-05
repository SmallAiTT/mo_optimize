module mo_ui._parser{

    export class UIScale9Data extends UIWidgetData{
        public scale9Enabled:boolean = false;
        public scale9Grid:number[] = [0,0,1,1];//x,y,w,h
    }

    export class UIRootData{
        public designHeight:number = 0;
        public designWidth:number = 0;
        public textures:string[] = [];
        public widgetTree:UIWidgetData;
        public dataScale:number = 1;//TODO 看具体适配决定是否有用
    }

    export class UILayoutParameter{
        public type:number = 0;
        public align:number = 0;//TODO
        public gravity:number = 0;
        public eageType:number = 0;//TODO
        public normalHorizontal:number = 0;
        public normalVertical:number = 0;
        public parentHorizontal:number = 0;
        public parentVertical:number = 0;
        public margin:number[] = [];//上右下左，保持和html一直的规则
    }

}