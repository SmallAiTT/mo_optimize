module mo{
    export function callFunc(selector: Function, selectorTarget?: any, data?: any):egret.action.CallFunc{
        return egret.action.CallFunc.create.apply(egret.action.CallFunc, arguments);
    }

    export function sequence(...actions: any[]):egret.action.Sequence{
        return egret.action.Sequence.create.apply(egret.action.Sequence, arguments);
    }

    export function spawn(...actions: any[]):egret.action.Spawn{
        return egret.action.Spawn.create.apply(egret.action.Spawn, arguments);
    }

    export function repeat(action: any, times: number):egret.action.Repeat{
        return egret.action.Repeat.create.apply(egret.action.Repeat, arguments);
    }

    export function repeatForever(action: any):egret.action.RepeatForever{
        return egret.action.RepeatForever.create.apply(egret.action.RepeatForever, arguments);
    }

    export function moveBy(duration: number, pos:Point):egret.action.MoveBy{
        return egret.action.MoveBy.create(duration, pos.x, pos.y);
    }

    export function moveTo(duration: number, pos:Point):egret.action.MoveTo{
        return egret.action.MoveTo.create(duration, pos.x, pos.y);
    }

    export function scaleBy(duration: number, sx: number, sy?: number):egret.action.ScaleBy{
        return egret.action.ScaleBy.create.apply(egret.action.ScaleBy, arguments);
    }

    export function scaleTo(duration: number, sx: number, sy?: number):egret.action.ScaleTo{
        return egret.action.ScaleTo.create.apply(egret.action.ScaleTo, arguments);
    }

    export function skewBy(duration: number, skx: number, sky?: number):egret.action.SkewBy{
        return egret.action.SkewBy.create.apply(egret.action.SkewBy, arguments);
    }

    export function skewTo(duration: number, skx: number, sky?: number):egret.action.SkewTo{
        return egret.action.SkewTo.create.apply(egret.action.SkewTo, arguments);
    }

    export function rotateBy(duration: number, rotate: number):egret.action.RotateBy{
        return egret.action.RotateBy.create.apply(egret.action.RotateBy, arguments);
    }

    export function rotateTo(duration: number, rotate: number):egret.action.RotateTo{
        return egret.action.RotateTo.create.apply(egret.action.RotateTo, arguments);
    }

    export function jumpBy(duration: number, pos:Point, height: any, jumps: any):egret.action.JumpBy{
        return egret.action.JumpBy.create(duration, pos.x, pos.y, height, jumps);
    }

    export function jumpTo(duration: number, pos:Point, height: any, jumps: any):egret.action.JumpTo{
        return egret.action.JumpTo.create(duration, pos.x, pos.y, height, jumps);
    }

    export function fadeTo(duration: number, alpha: number):egret.action.FadeTo{
        return egret.action.FadeTo.create.apply(egret.action.FadeTo, arguments);
    }

    export function fadeIn(duration: number):egret.action.FadeIn{
        return egret.action.FadeIn.create.apply(egret.action.FadeIn, arguments);
    }

    export function fadeOut(duration: number):egret.action.FadeOut{
        return egret.action.FadeOut.create.apply(egret.action.FadeOut, arguments);
    }

    export function delayTime(duration: number):egret.action.DelayTime{
        return egret.action.DelayTime.create.apply(egret.action.DelayTime, arguments);
    }

    //椭圆滚动
    export function ellipse(duration:number, centerPosition:Point, aLength:number, cLength:number):mo.action.Ellipse{
        return mo.action.Ellipse.create.apply(mo.action.Ellipse, arguments);
    }

    //晃动
    export function shake(duration:number, strengthX:number, strengthY:number):mo.action.Shake{
        return mo.action.Shake.create.apply(mo.action.Shake, arguments);
    }

    //bezier
    export function bezierBy(t, c):mo.action.BezierBy{
        return mo.action.BezierBy.create.apply(mo.action.BezierBy, arguments);
    }

    //bezier
    export function bezierTo(t, c):mo.action.BezierTo{
        return mo.action.BezierTo.create.apply(mo.action.BezierTo, arguments);
    }

    //bezier
    export function track(trackTarget:any, trackSpeed:number, callback:any,callTarget:any):mo.action.Track{
        return mo.action.Track.create.apply(mo.action.Track, arguments);
    }
}