module mo_ui.LinearGravity{
    export var none:number = 0;
    export var left:number = 1;
    export var centerHorizontal:number = 2;
    export var right:number = 3;
    export var top:number = 4;
    export var centerVertical:number = 5;
    export var bottom:number = 6;
}
module mo_ui.RelativeAlign{
    export var alignNone:number = 0;
    export var alignParentTopLeft:number = 1;
    export var alignParentTopCenterHorizontal:number = 2;
    export var alignParentTopRight:number = 3;
    export var alignParentLeftCenterVertical:number = 4;
    export var centerInParent:number = 5;
    export var alignParentRightCenterVertical:number = 6;
    export var alignParentLeftBottom:number = 7;
    export var alignParentBottomCenterHorizontal:number = 8;
    export var alignParentRightBottom:number = 9;
}

module mo_ui.LayoutParameterType{
    export var none:number = 0;
    export var linear:number = 1;
    export var relative:number = 2;
}

module mo_ui{
    export class Margin{
        public left:number = 0;
        public top:number = 0;
        public right:number = 0;
        public bottom:number = 0;
        //上右下左，保持和css样式一致
        constructor(margin?:any, right?:number, bottom?:number, left?:number){
            this.setMargin.apply(this, arguments);
        }

        public setMargin(margin?:any, right?:number, bottom?:number, left?:number){
            if (margin instanceof Margin) {
                this.top = margin.top||0;
                this.right = margin.right||0;
                this.bottom = margin.bottom||0;
                this.left = margin.left||0;
            }else if(margin instanceof Array){
                this.top = margin[0]||0;
                this.right = margin[1]||0;
                this.bottom = margin[2]||0;
                this.left = margin[3]||0;
            }else{
                this.top = margin||0;
                this.right = right||0;
                this.bottom = bottom||0;
                this.left = left||0;
            }
        }
        public equals(target){
            return (this.left == target.left && this.top == target.top && this.right == target.right && this.bottom == target.bottom);
        }
    }


    export class Padding{
        public left:number = 0;
        public top:number = 0;
        public right:number = 0;
        public bottom:number = 0;
        //上右下左，保持和css样式一致
        constructor(padding?:any, right?:number, bottom?:number, left?:number){
            this.setMargin.apply(this, arguments);
        }

        public setMargin(padding?:any, right?:number, bottom?:number, left?:number){
            if (padding instanceof Margin) {
                this.top = padding.top||0;
                this.right = padding.right||0;
                this.bottom = padding.bottom||0;
                this.left = padding.left||0;
            }else if(padding instanceof Array){
                this.top = padding[0]||0;
                this.right = padding[1]||0;
                this.bottom = padding[2]||0;
                this.left = padding[3]||0;
            }else{
                this.top = padding||0;
                this.right = right||0;
                this.bottom = bottom||0;
                this.left = left||0;
            }
        }
        public equals(target){
            return (this.left == target.left && this.top == target.top && this.right == target.right && this.bottom == target.bottom);
        }
    }
}

module mo_ui.LayoutBackGroundColorType {
    export var none:number = 0;
    export var solid:number = 1;
    export var gradient:number = 2;
}
module mo_ui.LayoutType{
    export var absolute:number = 0;
    export var linearVertical:number = 1;
    export var linearHorizontal:number = 2;
    export var relative:number = 3;
}
module mo_ui.LayoutClippingType {
    export var stencil:number = 0;
    export var scissor:number = 1;
}
module mo_ui{
    export class LayoutParameter extends mo_base.Class{
        static LINEAR_ALIGN_HT_LEFT:number = 0;
        static LINEAR_ALIGN_HT_RIGHT:number = 1;

        _margin:Margin = new Margin();
        _type:number = LayoutParameterType.none;

        public setMargin(margin:Margin){
            var marginObj = this._margin;
            marginObj.left = margin.left || 0;
            marginObj.top = margin.top || 0;
            marginObj.right = margin.right || 0;
            marginObj.bottom = margin.bottom || 0;
        }
        public getMargin():Margin{
            return this._margin;
        }

        public getType():number{
            return this._type;
        }


        _padding:Padding = new Padding();
        public setPadding(padding:Padding){
            var paddingObj = this._padding;
            paddingObj.left = padding.left || 0;
            paddingObj.top = padding.top || 0;
            paddingObj.right = padding.right || 0;
            paddingObj.bottom = padding.bottom || 0;
        }
        public getPadding():Padding{
            return this._padding;
        }

        public clone():LayoutParameter{
            var parameter:LayoutParameter = new this.__class();
            parameter.copyProperties(this);
            return parameter;
        }
        public copyProperties(model){
            this._margin.left = model._margin.left || 0;
            this._margin.top = model._margin.top || 0;
            this._margin.right = model._margin.right || 0;
            this._margin.bottom = model._margin.bottom || 0;
        }
    }

    export class LinearLayoutParameter extends LayoutParameter{
        //@override
        _type:number = LayoutParameterType.linear;
        _gravity:number;
        _setGravity(gravity:number){
            this._gravity = gravity;
        }
        public set gravity(gravity:number){
            this._setGravity(gravity);
        }
        public get gravity():number{
            return this._gravity;
        }
        /**
         * @deprecated
         * @param gravity
         */
        public setGravity(gravity:number){
            this._setGravity(gravity);
        }
        /**
         * @deprecated
         */
        public getGravity():number{
            return this._gravity;
        }
        //@override
        public copyProperties(model){
            super.copyProperties(model);
            this._setGravity(model._gravity);
        }
    }

    export class RelativeLayoutParameter extends LayoutParameter{
        //@override
        _type:number = LayoutParameterType.relative;
        _put:boolean = false;

        _align:number = RelativeAlign.alignNone;
        _setAlign(align:number){
            this._align = align;
        }
        public set align(align:number){
            this._setAlign(align);
        }
        public get align():number{
            return this._align;
        }
        /**
         * @deprecated
         * @param align
         */
        public setAlign(align:number){
            this._setAlign(align);
        }
        /**
         * @deprecated
         */
        public getAlign():number{
            return this._align;
        }

        //@override
        public copyProperties(model){
            super.copyProperties(model);
            this._setAlign(model._align);
        }
    }

}

module mo_opt{

    export class _UIPanelOption extends mo_opt._UIWidgetOption{
        layoutType: number;//布局类型
        doLayoutDirty;
        clippingEnabled;//是否开启裁剪
        clippingDirty;
        bgOpacity:number;
        bgColor:number;
        bgColorDirty:boolean;
        bgTexture:egret.Texture;
        graphics:egret.Graphics;//获取 Shape 中的 Graphics 对象。【只读】

        autoSizeEnabled:boolean;//是否启用自动大小设置。只有当其为线性布局是才有用。
        richText:mo_ui.UIText;
        childSrcSizeMap:any;
        //@override
        _initProp():void{
            super._initProp();
            var self = this;

            self.layoutType = mo_ui.LayoutType.absolute;//布局类型
            self.doLayoutDirty = true;
            self.clippingEnabled = false;//是否开启裁剪
            self.clippingDirty = false;
            self.bgOpacity = 0;
            self.bgColor = 0;
            self.bgColorDirty = false;
            self.bgTexture = null;
            self.graphics = null;//获取 Shape 中的 Graphics 对象。【只读】

            self.autoSizeEnabled = false;//是否启用自动大小设置。只有当其为线性布局是才有用。
            self.richText = null;
            self.childSrcSizeMap = null;
        }

        dtor(){
            super.dtor();
            var self = this;
            self.graphics = null;//获取 Shape 中的 Graphics 对象。【只读】
            self.scale9Grid = null;
            self.richText = null;
            self.childSrcSizeMap = null;
        }

    }
}