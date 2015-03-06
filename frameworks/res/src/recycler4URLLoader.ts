module res{
    var _recycler:egret.URLLoader[] = [];
    export function getURLLoader(dataFormat?:string){
        var loader:egret.URLLoader = _recycler.pop();
        if(!loader){
            loader = new egret.URLLoader();
        }else{
//            loader.removeEventListener()
        }
        loader.dataFormat = dataFormat;
        return loader;
    }
}