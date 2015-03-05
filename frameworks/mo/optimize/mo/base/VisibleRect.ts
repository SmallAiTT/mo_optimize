/**
* Created by lihex on 12/18/14.
*/
module mo{
    export class VisibleRect extends mo_base.Class{
        private _topLeft:Point;
        private _topRight:Point;
        private _top:Point;
        private _bottomLeft:Point;
        private _bottomRight:Point;
        private _bottom:Point;
        private _center:Point;
        private _left:Point;
        private _right:Point;
        private _width:number;
        private _height:number;
        private _size:Size;

        _initProp(){
            super._initProp();
            var self = this;
            self._topLeft = p(0, 0);
            self._topRight = p(0, 0);
            self._top = p(0, 0);
            self._bottomLeft = p(0, 0);
            self._bottomRight = p(0, 0);
            self._bottom = p(0, 0);
            self._center = p(0, 0);
            self._left = p(0, 0);
            self._right = p(0, 0);
            self._width = 0;
            self._height = 0;
            self._size = size(0, 0);
        }
        
        init():void{
            var self = this;

            var stage:egret.Stage = egret.MainContext.instance.stage;
            var w = self._width = stage.stageWidth;
            var h = self._height = stage.stageHeight;
            self._size = mo.size(w, h);

            var x = stage.x;
            var y = stage.y;

            var left = x;
            var right = x + w;
            var middle = x + w/2;

            self._top.y = self._topLeft.y = self._topRight.y = y;
            self._left.x = self._topLeft.x = self._bottomLeft.x = left;
            self._right.x = self._bottomRight.x = self._topRight.x = right;
            self._center.x = self._bottom.x = self._top.x = middle;
            self._bottom.y = self._bottomRight.y = self._bottomLeft.y = y + h;
            self._right.y = self._left.y = self._center.y = y + h/2;
        }
        getSize():Size{
            return mo.size(this._size);
        }
        getWidth():number{
            return this._width;
        }
        getHeight():number{
            return this._height;
        }
        topLeft():Point{
            return mo.p(this._topLeft);
        }
        topRight():Point{
            return mo.p(this._topRight);
        }
        top():Point{
            return mo.p(this._top);
        }
        bottomLeft():Point{
            return mo.p(this._bottomLeft);
        }
        bottomRight():Point{
            return mo.p(this._bottomRight);
        }
        bottom():Point{
            return mo.p(this._bottom);
        }
        center():Point{
            return mo.p(this._center);
        }
        left():Point{
            return mo.p(this._left);
        }
        right():Point{
            return mo.p(this._right);
        }
    }
    export var visibleRect:VisibleRect;
}
