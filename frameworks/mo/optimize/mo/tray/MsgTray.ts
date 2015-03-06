module mo{
    export class MsgTray extends Tray{
        static __className:string = "MsgTray";

        //@override
        _initProp(){
            super._initProp();
            this._setPenetrable(false);//托盘设置为不可穿透
        }
    }
}