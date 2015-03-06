module mo{
    export class LoadingTray extends Tray{
        static __className:string = "LoadingTray";

        //@override
        _initProp(){
            super._initProp();
            this._setPenetrable(false);//托盘设置为不可穿透
        }
    }
}