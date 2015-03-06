module global{}
module mo_base{
    export class Project{
        debugMode:number = 1;
        renderMode:number = 0;
        showFPS:boolean = false;
        frameRate:number = 60;

        version:string = "0.1.0";
        assetsHost:string;
        assetsPort:string;
        httpHost:string;
        httpPort:string;
        logServer:boolean = false;

        isDev:boolean = false;

        design:any;
        resolution:any;
        audioEnabled:boolean = false;
        guideEnabled:boolean = false;
        isSandBox:boolean = true;
        isValidIAP:boolean = false;
        armatureDemoEnabled:number = 0;
        fightAreaEnabled:boolean = false;
        fightSimulateEnabled:boolean = true;
        ccaContentScale:number = 0.85;
        channel:string;

        option:any = {};

        //以后可能删除的
        isScatterMode:boolean = false;

        static setData(project:Project, data:any){
            project.debugMode = data["debugMode"] || project.debugMode;
            project.renderMode = data["renderMode"] || project.renderMode;
            project.showFPS = data["showFPS"] != null ? data["showFPS"] : project.showFPS;
            project.frameRate = data["frameRate"] || project.frameRate;
            project.version = data["version"] || project.version;
            project.assetsHost = data["assetsHost"] || project.assetsHost;
            project.assetsPort = data["assetsPort"] || project.assetsPort;
            project.httpHost = data["httpHost"] || project.httpHost;
            project.httpPort = data["httpPort"] || project.httpPort;
            project.logServer = data["logServer"] != null ? data["logServer"] : project.logServer;
            project.isDev = data["isDev"] != null ? data["isDev"] : project.isDev;
            if(data["design"]) {
                project.design = { width : data["design"]["width"], height : data["design"]["height"] };
            }
            if(data["resolution"]) {
                project.resolution = { width : data["resolution"]["width"], height : data["resolution"]["height"] };
            }
            project.audioEnabled = data["audioEnabled"] != null ? data["audioEnabled"] : project.audioEnabled;
            project.guideEnabled = data["guideEnabled"] != null ? data["guideEnabled"] : project.guideEnabled;
            project.isSandBox = data["isSandBox"] != null ? data["isSandBox"] : project.isSandBox;
            project.isValidIAP = data["isValidIAP"] != null ? data["isValidIAP"] : project.isValidIAP;
            project.armatureDemoEnabled = data["armatureDemoEnabled"] != null ? data["armatureDemoEnabled"] : project.armatureDemoEnabled;
            project.fightAreaEnabled = data["fightAreaEnabled"] != null ? data["fightAreaEnabled"] : project.fightAreaEnabled;
            project.fightSimulateEnabled = data["fightSimulateEnabled"] != null ? data["fightSimulateEnabled"] : project.fightSimulateEnabled;
            project.ccaContentScale = data["ccaContentScale"] || project.ccaContentScale;
            project.channel = data["channel"] || project.channel;
            project.option = data["option"] || project.option;
            project.isScatterMode = data["isScatterMode"] != null ? data["isScatterMode"] : project.isScatterMode;
        }
    }

    export var project:Project;

    var _projectHandler = new egret.evt.EventDispatcher();
    export function onProjectJsonOnce(listener:Function, ctx?:any){
        var func = function(){
            _projectHandler.removeEventListener("projectJson", func, null);
            listener.call(ctx);
        };
        _projectHandler.addEventListener("projectJson", func, null);
    }
    export function loadProject(cb:Function, ctx?:any){
        var resArr:any[] = ["resource/project.json"];
        if(egret.MainContext.runtimeType == egret.MainContext.RUNTIME_HTML5){
            var resCfgItem = new res.ResCfgItem();
            resCfgItem.url = "resource/myProject.json";
            resCfgItem.logEnabled = false;
            resArr.push(resCfgItem);
        }
        res.load(resArr, function(err, results){
            project = new Project();
            Project.setData(project, results[0]);
            if(results[1]) Project.setData(project, results[1]);
            if(egret.MainContext.runtimeType == egret.MainContext.RUNTIME_HTML5){
                //Project.setData(project, global["project"]); TODO
            }

            if(_projectHandler.willTrigger("projectJson")){
                var event = new egret.evt.Event("projectJson");
                _projectHandler.dispatchEvent(event);
            }
            logger.resetByMode(project.debugMode)
            cb.call(ctx, project);
        });
    }
}