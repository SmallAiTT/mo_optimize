module res{
    var _ = res;

    export class ImageParser extends ResParser{
        //@override
        public _dataFormat:string = egret.URLLoaderDataFormat.TEXTURE;
        //@override
        public _parse(resCfgItem:ResCfgItem, data:any):any{
            //这里进行内容的处理，将处理完的结果返回
            var str:string = resCfgItem["scale9grid"];
            if(str){
                var list:Array<string> = str.split(",");
                data["scale9Grid"] = new egret.Rectangle(parseInt(list[0]),parseInt(list[1]),parseInt(list[2]),parseInt(list[3]));
            }
            return data;
        }
    }
    //@override
    ImageParser.TYPE = "image";
    registerParser(ImageParser, "png", "jpg");
}