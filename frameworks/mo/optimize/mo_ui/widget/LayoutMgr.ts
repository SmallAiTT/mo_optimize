module mo_ui{
    /**
     *
     * @param pWOrH
     * @param wOrH
     * @param aXOrY
     * @param poseType  0:左/上,1:中,2:右/下
     * @returns {number}
     */
    export function calLayoutXOrY(pWOrH:number, wOrH:number, aXOrY:number, poseType:number):number{
        return pWOrH*poseType/2 - wOrH*(poseType/2-aXOrY);
    }
    export function doLayout(node:any, layoutType){
        var parent = node._parent, width = parent.width, height = parent.height;
        var locLayoutParameter = node.getLayoutParameter(LayoutParameterType.relative);
        if (locLayoutParameter) {
            var lax = node.anchorX, lay = node.anchorY;
            var locAlign = locLayoutParameter.align;

            var xPosType = locAlign ? (locAlign-1)%3 : 0;
            var yPosType = locAlign ? Math.floor((locAlign-1)/3) : 0;

            var mw = 0, mh = 0, locMargin:Margin = locLayoutParameter.getMargin();
            if(xPosType == 0) mw = locMargin.left || 0;
            else if(xPosType == 2) mw = -(locMargin.right || 0);
            if(yPosType == 0) mh = locMargin.top || 0;
            else if(yPosType == 2) mh = -(locMargin.bottom || 0);

            var locFinalPosX = calLayoutXOrY(width, node.width, lax, xPosType) + mw;
            var locFinalPosY = calLayoutXOrY(height, node.height, lay, yPosType) + mh;

            node.setPosition(mo.p(locFinalPosX, locFinalPosY));
        }
    }
}