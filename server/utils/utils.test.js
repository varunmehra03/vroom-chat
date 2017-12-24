const expect = require('expect');
const {createMessage, createCoordsMessage} = require('./utils');

describe('createMessage', ()=>{

    it('Should create message object with timestamp', ()=>{
        let from = 'Test', text='Test Message';
        let messageObj = createMessage(from, text);
        expect(typeof messageObj.createdAt).toBe('number');
        expect(messageObj.from).toEqual(from);
        expect(messageObj.text).toEqual(text);
    });
});

describe('createCoordsMessage', ()=>{

    it('Should create location message object with latitude and longitude', ()=>{
        let from = 'Test', latitude=12.9000, longitude = 70.9930;
        let messageObj = createCoordsMessage(from, latitude, longitude);
        expect(typeof messageObj.createdAt).toBe('number');
        expect(messageObj.from).toEqual(from);
        expect(messageObj.url).toEqual(`https://www.google.com/maps?q=${latitude},${longitude}`);
    });
});