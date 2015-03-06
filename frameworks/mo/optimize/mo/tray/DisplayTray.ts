module mo{
    export class DisplayTray extends Tray{
        static __className:string = "DisplayTray";

        //@override
        _initProp(){
            super._initProp();
            this._setPenetrable(false);//托盘设置为不可穿透
        }
    }
}