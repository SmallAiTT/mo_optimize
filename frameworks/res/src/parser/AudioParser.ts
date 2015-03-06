module res{
    var _ = res;

    export class AudioParser extends ResParser{
        //@override
        public _dataFormat:string = egret.net.URLLoaderDataFormat.SOUND;
        //@override
        public _parse(resCfgItem:ResCfgItem, data:any):any{
            //这里进行内容的处理，将处理完的结果返回
            data.preload(resCfgItem["soundType"] || egret.Sound.EFFECT);
            return data;
        }
    }
    //@override
    AudioParser.TYPE = "audio";
    registerParser(AudioParser, "mp3", "ogg");
}