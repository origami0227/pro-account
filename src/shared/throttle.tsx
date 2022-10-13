export const throttle = (fn: Function, time: number) => {
    let timer: number | undefined = undefined
    return (...args: any[]) => {//返回的函数调用后就不再调用了
        if (timer) {//调用过则ruturn
            return
        } else {
            fn(...args)
            timer = setTimeout(() => {
                timer = undefined
            }, time)//一段时间后重置timer
        }
    }
}