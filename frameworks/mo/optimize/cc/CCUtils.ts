module cc{

    export var RED:number = 0xff0000;
    export var GREEN:number = 0x00ff00;
    export var BLUE:number = 0x0000ff;
    export var BLACK:number = 0x000000;
    export var WHITE:number = 0xffffff;
    export var YELLOW:number = 0xffff00;
    export var GRAY:number = 0x333333;
    export var MAGENTA:number = 0xff00ff;
    export var ORANGE:number = 0xff7f00;

    export function c3b(r:number, g:number, b:number):number{
        return r << 16 | g << 8 | b;
    }

    export function convertColor3BtoHexString (clr) {
        var hR = clr.r.toString(16);
        var hG = clr.g.toString(16);
        var hB = clr.b.toString(16);
        var stClr = "#" + (clr.r < 16 ? ("0" + hR) : hR) + (clr.g < 16 ? ("0" + hG) : hG) + (clr.b < 16 ? ("0" + hB) : hB);
        return stClr;
    }

    export function hexToColor (hex) {
        hex = hex.replace(/^#?/, "0x");
        var c = parseInt(hex);
        return c;
    }
}