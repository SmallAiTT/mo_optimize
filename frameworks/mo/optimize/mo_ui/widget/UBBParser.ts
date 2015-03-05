/**
 * Created by lihex on 12/24/14.
 */
module mo_ui {
    export class UbbTextElement {
        text:string;
        color;
        fontSize:number;
        font:string;
        constructor(text:string = "", color:number = 0xffffff, fontSize:number = 42, font:string = "微软雅黑") {
            this.text = text;
            this.color = color;
            this.fontSize = fontSize;
            this.font = font;
        }
        setValue(k, v){
            var self = this;
            switch (k){
                case "text":
                    this.text = v;
                    break;
                case "color":
                    this.color = self._convertColorFromStr(v);
                    break;
                case "size":
                    this.fontSize = v;
                    break;
                case "font":
                    this.font = v;
                    break;
                default :
                    logger.warn("未知的属性：", k);
                    break;
            }
        }

        toTextFlowElement():Object{
            var e:any = {};
            if(this.text == UBBParser.LINE_BREAK_TAG){
                e.text = "\n";
            }else{
                e.text = this.text;
                e.style = {"textColor": this.color, "size": this.fontSize, "fontFamily": this.font};
            }
            return e;
        }

        _convertColorFromStr(color){
            switch (color.toLowerCase()) {
                case "white":
                    return cc.WHITE;
                    break;
                case "yellow":
                    return cc.YELLOW;
                    break;
                case "blue":
                    return cc.BLUE;
                    break;
                case "green":
                    return cc.GREEN;
                    break;
                case "red":
                    return cc.RED;
                    break;
                case "magenta":
                    return cc.MAGENTA;
                    break;
                case "black":
                    return cc.BLACK;
                    break;
                case "orange":
                    return cc.ORANGE;
                    break;
                case "gray":
                    return cc.GRAY;
                    break;
                default :
                    if(color.indexOf("#") != -1){
                        return cc.hexToColor(color);
                    }
                    else{
                        return parseInt(color);
                    }
                    break;
            }
        }
    }

    export class UBBParser{
        static LINE_BREAK_TAG:string = "[/br]";
        static UBB_TAG = "/ubb]";

        _ubbElements;
        _defFontSize;
        _defFontName;
        _defColor;

        constructor(defaultFntSize = 42, defaultFntName = "微软雅黑", defaultColor = 0xffffff){
            this.resetDefault(defaultFntSize, defaultFntName, defaultColor);
        }

        public static getInstance(...args:any[]){
            var Class:any = this;
            if(!Class._instance){
                var instance:any = Class._instance = new UBBParser();
                instance.resetDefault.apply(instance, arguments);
                instance._isInstance = true;
            }
            return Class._instance;
        }

        public resetDefault(defaultFntSize = 42, defaultFntName = "微软雅黑", defaultColor = 0xffffff){
            this._defFontSize = defaultFntSize;
            this._defFontName = defaultFntName;
            this._defColor = defaultColor;
            this._ubbElements = [];
        }

        public ubb2TextFlow(str:string):any{
            if(this.checkIsExitUBB(str)){
                var arr:Array<egret.ITextElement> = [];
                this._ubbElements = [];
                this._parseUBB(str);
                for(var i = 0, li = this._ubbElements.length; i < li; i++){
                    arr.push(this._ubbElements[i].toTextFlowElement());
                }
                return arr;
            }else{
                return str;
            }
        }

        _parseUBB(str){
            var ubbParseReg = /^[^\[]+|\[ubb[^\[]+\[\/ubb\]|[^\]]+$|[^\[\]]+/g;

            var brArr = str.split(UBBParser.LINE_BREAK_TAG), ubb;

            for (var i = 0; i < brArr.length; i++) {
                var br = brArr[i];
                if(br == null) continue;
                // 需要换行
                if(i > 0) this._ubbElements.push(new UbbTextElement(UBBParser.LINE_BREAK_TAG));
                if(br == ""){ //fixme: 支持中间有空白行的情况，空白行里添加一个空格字符，不然会有问题
                    this._ubbElements.push(new UbbTextElement(" "));
                    continue;
                }
                ubb = br.match(ubbParseReg);
                for (var j = 0; j < ubb.length; j++) {
                    var obj = ubb[j], eleObj;
                    if (this.checkIsExitUBB(obj)) {
                        eleObj = this._splitUbbAttr(obj);
                        eleObj["text"] = this._parseTextFromStr(obj);
                    }
                    else {
                        eleObj = new UbbTextElement(obj, this._defColor, this._defFontSize, this._defFontName);
                    }
                    this._ubbElements.push(eleObj);
                }
            }
        }

        _parseTextFromStr(ubbStr) {
            var ubbTextReg = /\](.+)\[/gi;
            var result = ubbTextReg.exec(ubbStr);
            return result ? result[1] : null;
        }

        _splitUbbAttr(str){
            var ele = new UbbTextElement("",this._defColor, this._defFontSize, this._defFontName);
            var ubbStr = str.match(/[^\s]+=[^\s\]]+/ig);
            if(ubbStr){
                for (var i = 0; i < ubbStr.length; i++) {
                    var str = ubbStr[i];
                    var attr = str.split("=");
                    ele.setValue(attr[0], attr[1]);
                }
            }
            return ele;
        }
        public checkIsExitUBB (str) {
            return (str.indexOf(UBBParser.UBB_TAG) !== -1) || (str.indexOf(UBBParser.LINE_BREAK_TAG) !== -1);
        }
    }
}