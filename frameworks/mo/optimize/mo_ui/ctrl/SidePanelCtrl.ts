/**
 * Created by lihex on 12/19/14.
 */
module mo_ui {
    export class SidePanelCtrl extends mo_base.Class {
        static __className:string = "SidePanelCtrl";

        widget :any ;
        _leftPanel :any ;
        _rightPanel :any ;
        _leftSize :any ;
        _rightSize :any ;
        _leftDesignPos :any ;
        _rightDesignPos :any ;
        _hiddenPos :any ;
        _center :any ;

        actionEventType:string;

        isRightBack: boolean;

        //@override
        init(widget:UIWidget, leftPanelName, rightPanelName, splitWidth){
            var self = this;
            self.actionEventType = gEventType.slidePanel;
            self.widget = widget;
            var leftPanel = self._leftPanel = widget.getWidgetByName(leftPanelName);
            var rightPanel = self._rightPanel = widget.getWidgetByName(rightPanelName);
            var sizeOfLeftPanel = self._leftSize = leftPanel.getSize();
            var sizeOfRightPanel = self._rightSize = rightPanel.getSize();
            var designPosOfLeftPanel:mo.Point = leftPanel.getPosition();
            var designPosOfRightPanel:mo.Point = rightPanel.getPosition();
            var size = widget.getSize();
            var splitWidth2 = (size.width - sizeOfLeftPanel.width - sizeOfRightPanel.width - splitWidth)/2;
            var distance1 = splitWidth2;
            var distance2 = splitWidth + splitWidth2 + sizeOfLeftPanel.width;
            self._leftDesignPos = mo.p(distance1, designPosOfLeftPanel.y);
            self._rightDesignPos = mo.p(distance2, designPosOfRightPanel.y);
            self._hiddenPos = mo.p(-sizeOfLeftPanel.width, designPosOfLeftPanel.y);
            self._center = mo.p(size.width/2 - sizeOfRightPanel.width/2, designPosOfRightPanel.y);
            self.reset();
        }

        reset (){
            var self = this;
            self.isRightBack = true;
            self._leftPanel.setPosition(self._hiddenPos);
            self._rightPanel.setPosition(self._center);
            self._leftPanel.setVisible(false);
        }

        runRight (cb, target?){
            var self = this;
            var pos = self.isRightBack ? self._rightDesignPos : self._center;
            var act = mo_act.moveTo(0.25, pos).setEase(mo_act.Ease.backOut);
            act = mo_act.sequence(act, mo_act.callFunc(function(){
                self.isRightBack = !self.isRightBack;
                if(cb){
                    cb.apply(target);
                }
            }, this));
            self._rightPanel.runAction(act);
        }

        leftIn (cb, target){
            var self = this;
            var panel = self._leftPanel;
            panel.setVisible(true);
            var act = mo_act.moveTo(0.25, self._leftDesignPos).setEase(mo_act.Ease.backOut);
            act = mo_act.sequence(act, mo_act.callFunc(function(){
                mo_evt.dispatchEvent([[mo_evt.actionDispatcher, self.actionEventType]], function(){
                    if(cb){
                        cb.apply(target);
                    }
                }, self);
            }, self));
            panel.runAction(act);
        }

        leftOut (cb, target){
            var self = this;
            var panel = self._leftPanel;
            var act = mo_act.moveTo(0.25, self._hiddenPos).setEase(mo_act.Ease.sineInOut);
            act = mo_act.sequence(act, mo_act.callFunc(function(){
                panel.setVisible(false);
                if(cb){
                    cb.apply(target);
                }
            }, self));
            panel.runAction(act);
        }
    }
}