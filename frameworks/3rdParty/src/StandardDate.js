/**
 * 初始化本地的服务器时间。
 * @param serverDate
 */
Date.setStandard = function(serverDate){
    var self = this;
    self._serverDate = serverDate ? new Date(serverDate) : new Date();
    self._dateToGotServerDate = new Date();
};
/**
 * 获取当前游戏时间
 * @param {*} date
 * @returns {Date}
 */
Date.newDate = function(date){
    var self = this;
    if(date){
        return new Date(date);
    }
    if(!self._serverDate) self.setStandard();
    var nowTime = (new Date()).getTime();
    var t = self._serverDate.getTime() + nowTime - self._dateToGotServerDate.getTime();
    return new Date(t);
};

Date.now = function(){
    return Date.newDate().getTime();
};

/** @expose */
Date.setStandard;
/** @expose */
Date.newDate;