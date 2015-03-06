interface CronTime{
    source:any;
    zone:any;
    second:Object;
    minute:Object;
    hour:Object;
    dayOfWeek:Object;
    dayOfMonth:Object;
    month:Object;

    /**
     * calculates the next send time
     */
    sendAt():Date;
    /**
     * Get the number of milliseconds in the future at which to fire our callbacks.
     */
    getTimeout():number;
    /**
     * writes out a cron string
     */
    toString():string;
    /**
     * Json representation of the parsed cron syntax.
     */
    toJSON():string[];
    /**
     * get next date that matches parsed cron time
     */
    _getNextDateFrom(start:Date):Date;
    /**
     * get next date that is a valid DST date
     */
    _findDST(date:Date):Date;
    /**
     * wildcard, or all params in array (for to string)
     */
    _wcOrAll(type:string):string;
    /**
     */
    _hasAll(type:string):boolean;
    /**
     * Parse the cron syntax.
     */
    _parse():string;
    /**
     * Parse a field from the cron syntax.
     */
    _parseField(field:string, type:string, constraints:number[]):void;
}
interface ICronTime_Aliases {
    jan:number;
    feb:number;
    mar:number;
    apr:number;
    may:number;
    jun:number;
    jul:number;
    aug:number;
    sep:number;
    oct:number;
    nov:number;
    dec:number;
    sun:number;
    mon:number;
    tue:number;
    wed:number;
    thu:number;
    fri:number;
    sat:number;
}
declare var CronTime:{
    map:string[];
    constraints:Array<number[]>;
    parseDefaults:string[];
    aliases:ICronTime_Aliases;

    new(source, zone):CronTime;
};
interface CronJob{
    _callbacks:Function[];

    context:any;
    onComplete:Function;
    cronTime:CronTime;

    /**
     * Fire all callbacks registered.
     */
    _callback():void;

    /**
     * Add a method to fire onTick
     */
    addCallback(callback):void;
    /**
     * Manually set the time of a job
     */
    setTime(time:Date):void;
    /**
     * Return the next scheduled date for a job
     */
    nextDate():Date;
    /**
     * Start the cronjob.
     */
    start():void;
    /**
     * Stop the cronjob.
     */
    stop():void;
}

declare var CronJob:{
    new(cronTime, onTick, onComplete, start, timeZone, context):CronJob;
    new(cronTime, ...args):CronJob;
};
