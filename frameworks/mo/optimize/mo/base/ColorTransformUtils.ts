/**
 * Created by huanghaiying on 15/1/9.
 */
class ColorTransformUtils {

    constructor() {
    }

    private static _transformCache:any = {};
    private static _transformMatrix:any = null;

    public static getTransform(type:number):egret.ColorTransform {
        if (ColorTransformUtils._transformMatrix == null) {
            ColorTransformUtils._transformMatrix = {};
            ColorTransformUtils._transformMatrix[ColorTransformType.clone] = [-0.133425167215474,0.135020903628126,0.998404263587348,0,0,0.390814570523802,0.803383354786634,-0.194197925310436,0,0,-0.525056639777552,1.54329599043558,-0.0182393506580324,0,0,0,0,0,1,0];
            ColorTransformUtils._transformMatrix[ColorTransformType.skillDisabled] = [1,0,0,0,0,0,1,0,0,0,0,0,1,0,150,0,0,0,1,0];
            ColorTransformUtils._transformMatrix[ColorTransformType.gray] = [0.3, 0.6, 0, 0, 0, 0.3, 0.6, 0, 0, 0, 0.3, 0.6, 0, 0, 0, 0, 0, 0, 1, 0];
            ColorTransformUtils._transformMatrix[ColorTransformType.death] = [0.3, 0.6, 0, 0, 0, 0.3, 0.6, 0, 0, 0, 0.3, 0.6, 0, 0, 0, 0, 0, 0, 1, 0];
            ColorTransformUtils._transformMatrix[ColorTransformType.light] = [1,0,0,0,120,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0];
            ColorTransformUtils._transformMatrix[ColorTransformType.green] = [0,0,0,0,0,0,1,0,255,0,0,0,0,0,0,0,0,0,1,0];
            ColorTransformUtils._transformMatrix[ColorTransformType.blue] = [0,0,0,0,0,0,0,0,0,0,0,0,1,255,0,0,0,0,1,0];
            ColorTransformUtils._transformMatrix[ColorTransformType.purple] = [1,0,0,255,0,0,0,0,0,0,0,0,1,255,0,0,0,0,1,0];
            ColorTransformUtils._transformMatrix[ColorTransformType.fightMask] = [0.15,0,0,0,53.975,0,0.15,0,0,53.975,0,0,0.15,0,53.975,0,0,0,1,0];

        }

        if (!ColorTransformUtils._transformCache.hasOwnProperty(type)) {
            var transform:egret.ColorTransform = new egret.ColorTransform();
            transform.matrix = ColorTransformUtils._transformMatrix[type];
            ColorTransformUtils._transformCache[type] = transform;
        }
        return ColorTransformUtils._transformCache[type];
    }
}

class ColorTransformType {
    public static gray:number = 1;
    public static clone:number = 2;
    public static skillDisabled:number = 3;
    public static light:number = 4;
    public static green:number = 5;
    public static blue:number = 6;
    public static purple:number  = 7;
    public static fightMask:number  = 8;
    public static death:number  = 9;
}
