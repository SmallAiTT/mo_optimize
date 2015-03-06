module res{
    var _recycler:egret.net.URLLoader[] = [];
    export function getURLLoader(dataFormat?:string){
        var loader:egret.net.URLLoader = _recycler.pop();
        if(!loader){
            loader = new egret.net.URLLoader();
        }else{
//            loader.removeEventListener()
        }
        loader.dataFormat = dataFormat;
        return loader;
    }
}