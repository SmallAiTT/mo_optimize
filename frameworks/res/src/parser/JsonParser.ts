module res{
    var _ = res;

    export class JsonParser extends ResParser{
        //@override
        public _dataFormat:string = egret.URLLoaderDataFormat.TEXT;
        //@override
        public _parse(resCfgItem:ResCfgItem, data:any):any{
            //这里进行内容的处理，将处理完的结果返回
            try{
                return JSON.parse(data);
            }catch(e){
                console.error("JSON文件格式不正确: "+resCfgItem.url + "\ndata:" + data);
                return null;
            }
        }
    }
    //@override
    JsonParser.TYPE = "json";
    registerParser(JsonParser, "json");
}