const moment = require('moment');

// var createMessage = (from, text)=>{
//     return  {
//         from,
//         text,
//         createdAt: new Date().getTime()
//     };
// };
//
// var createCoordsMessage = (from, text)=>{
//     return  {
//         from:from,
//         text:text,
//         createdAt: new Date().getTime()
//     };
// };

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
    return {
        createMessage:createMessage,
        createCoordsMessage:createCoordsMessage

    }
})();
