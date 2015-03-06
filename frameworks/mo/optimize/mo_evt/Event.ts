module mo_evt {
    export class Event extends egret.evt.Event {

        public static getBeforeEventType(eventType):string{
            return "before_" + eventType;
        }
        public static getAfterEventType(eventType):string{
            return "after_" + eventType;
        }

        sender:any;
    }
}