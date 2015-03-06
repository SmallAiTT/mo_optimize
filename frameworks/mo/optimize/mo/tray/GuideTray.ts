module mo{
    export class GuideTray extends Tray{
        static __className:string = "GuideTray";

        //@override
        _initProp(){
            super._initProp();
        }

        showPre(){//在引导ui具体显示前先进行显示，目的是为了遮罩，防止点击
            var self = this;
            self._setPenetrable(false);//设置为不可穿透
            self._setVisible(true);
        }
        _setPenetrable(penetrable){
            super._setPenetrable(penetrable);
            var self = this;
            mo_ui.scrollEnabled = !self.visible || penetrable;
        }
        _setVisible(visible:boolean){
            super._setVisible(visible);
            mo_ui.scrollEnabled = !visible || this.penetrable;
        }
    }
}