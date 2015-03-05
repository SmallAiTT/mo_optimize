/**
 * Created by SmallAiTT on 2015/3/4.
 */
module mo_arr{

    export function resetArr(arr){
        if(arr){
            for(var i = arr.length - 1; i >= 0; --i){
                if(arr[i] == null){
                    arr.splice(i, 1);
                }
            }
        }
    }
    /**
     * 验证数组类型
     * @param {Array} arr
     * @param {function} type
     * @return {Boolean}
     * @function
     */
    export function ArrayVerifyType (arr:Array<any>, type:Function):boolean {
        if (arr && arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (!(arr[i] instanceof  type)) {
                    console.log("element type is wrong!");
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 根据index删除对象
     * @function
     * @param {Array} arr Source Array
     * @param {Number} index index of remove object
     */
    export function ArrayRemoveObjectAtIndex (arr:Array<any>, index:number) {
        arr.splice(index, 1);
    }

    /**
     * 删除某个对象
     * @function
     * @param {Array} arr Source Array
     * @param {*} delObj  remove object
     */
    export function ArrayRemoveObject (arr:Array<any>, delObj:any) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] == delObj) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    /**
     * @function
     * @param {Array} arr Source Array
     * @param {Array} minusArr minus Array
     */
    export function ArrayRemoveArray (arr:Array<any>, minusArr:Array<any>) {
        for (var i = 0, l = minusArr.length; i < l; i++) {
            ArrayRemoveObject(arr, minusArr[i]);
        }
    }

    /**
     * 获取对象在数据里的排序
     * @function
     * @param {Array} arr Source Array
     * @param {*} value find value
     * @return {Number} index of first occurence of value
     */
    export function ArrayGetIndexOfValue (arr:Array<any>, value:any):number {
        return arr.indexOf(value);
    }

    /**
     * 推送到数组里
     * @function
     * @param {Array} arr
     * @param {*} addObj
     */
    export function ArrayAppendObject (arr:Array<any>, addObj:any) {
        arr.push(addObj);
    }

    /**
     * 在数组里插入对象
     * @function
     * @param {Array} arr
     * @param {*} addObj
     * @param {Number} index
     * @return {Array}
     */
    export function ArrayAppendObjectToIndex (arr:Array<any>, addObj:any, index:number):Array<any> {
        arr.splice(index, 0, addObj);
        return arr;
    }

    /**
     * 在某个位置插入多个对象
     * @function
     * @param {Array} arr
     * @param {Array} addObjs
     * @param {Number} index
     * @return {Array}
     */
    export function ArrayAppendObjectsToIndex (arr:Array<any>, addObjs:Array<any>,index:number):Array<any>{
        arr.splice.apply(arr, [index, 0].concat(addObjs));
        return arr;
    }

    /**
     * 找出一个对象在数组里的index
     * @function
     * @param {Array} arr Source Array
     * @param {*} findObj find object
     * @return {Number} index of first occurence of value
     */
    export function ArrayGetIndexOfObject (arr:Array<any>, findObj:any):number {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] == findObj)
                return i;
        }
        return -1;
    }

    /**
     * 数组是否包含一个对象
     * @function
     * @param {Array} arr
     * @param {*} findObj
     * @return {Boolean}
     */
    export function ArrayContainsObject (arr:Array<any>, findObj:any):boolean {
        return arr.indexOf(findObj) != -1;
    }
}