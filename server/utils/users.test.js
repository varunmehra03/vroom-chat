const expect = require('expect');
const {Users} = require('./users');

describe('Users', ()=>{
    var users;
    beforeEach(()=>{
        users  = new Users();
        users.users=[{
            id:'1',
            name:'Varun',
            room:'App'
        },{
            id:'2',
            name:'Hari',
            room:'App'
        },{
            id:'3',
            name:'Raja',
            room:'QA'
        }];
    });
    it('Should add new user', ()=>{
        let users = new Users();
        let user = {id:'123',name:'Varun',room:'test'};
        let resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([resUser]);
    });

    it('Should return name of all users in App room', ()=>{
        let userList = users.getUserList('App');
        expect(userList).toEqual(['Varun','Hari']);

    });

    it('Should return name of all users in QA room', ()=>{
        let userList = users.getUserList('QA');
        expect(userList).toEqual(['Raja']);

    });

    it('Should get a user', ()=>{
        let user = users.getUser('1');
        expect(user.name).toEqual('Varun');

    });

    it('Should not get a user', ()=>{
        let user = users.getUser('99');
        expect(user).toEqual(undefined);
    });

    it('Should remove a user', ()=>{
        let user = users.removeUser('1');
        expect(user.id).toBe('1');
        expect(users.users.length).toEqual(2);

    });

    it('Should not remove a user', ()=>{
        let user = users.removeUser('99');
        expect(user).toEqual(undefined);
        expect(users.users.length).toEqual(3);

    });
});