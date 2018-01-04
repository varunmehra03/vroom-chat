const moment = require('moment');

module.exports = (function () {
    createMessage = (from, text)=>{
        return  {
            from,
            text,
            createdAt: moment().valueOf()
        };
    };
    createCoordsMessage = (from, latitude, longitude)=>{
        return  {
            from:from,
            url:`https://www.google.com/maps?q=${latitude},${longitude}`,
            createdAt: new Date().getTime()
        };
    };
    validateParams = (str)=>{
        return typeof str ==='string' && str.trim().length
    };
    return {
        createMessage:createMessage,
        createCoordsMessage:createCoordsMessage,
        validateParams:validateParams

    }
})();
