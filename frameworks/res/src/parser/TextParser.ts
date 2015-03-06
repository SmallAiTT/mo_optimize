module res{
    var _ = res;
    export class TextParser extends ResParser{
        //@override
        public _dataFormat:string = egret.URLLoaderDataFormat.TEXT;
    }
    //@override
    TextParser.TYPE = "text";
    registerParser(TextParser, "txt", "fsh", "vsh");
}