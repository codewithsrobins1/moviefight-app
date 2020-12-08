//Debouncing Input - wait for time to pass before using the input -- callbackFunc is the event function from onInput
const debounce = (callBackFunc, delay) => {
    let timeoutId;

    //...args takes all the arguements that are passed to the  callBackFunc
    return (...args) => {
        //On first keypress, timeoutId = undefined; On second keypress, timeoutId is now defined; as user keeps typing the setTimeout timer gets cleared/reset
        if(timeoutId) {
            clearTimeout(timeoutId); //stops pending timer -- clearTimeout clears a timer set with the setTimeout method
        }

        //Use setTimeout to delay the suggested movies - fetch the data after user stops typing for 1secs
        timeoutId = setTimeout(() => {
            callBackFunc.apply(null,args);  //apply - call the function as we normally would and take all the arguments and pass them in as separate arguements to the original function
        }, delay)
    }
}

