const Player = require("../models/Player");


const { createMockContext } = require('../context');
const { afterEach } = require("node:test");

let mockCtx

beforeEach(() => {
  mockCtx = createMockContext()
})

afterEach(() => {
    jest.clearAllMocks();
});

test('Test player id', () => {
    const player = new Player(89);
    expect(player.getId()).toBe(89);
});

test('find function returns the right player', async () => { 
    const user = {
        id: 800,
        name: 'Player 800',
        money: 11111
    }
    
    mockCtx.prisma.user.findUnique.mockResolvedValue(user)
    
    await expect(Player.find(800, mockCtx)).resolves.toEqual({
        id: 800,
        name: 'Player 800',
        money: 11111
    });
});

test('Buy property updates the property properly', async () => {
    const user = {
        id: 1,
        name: 'Player 800',
        money: 11112,
    };

    let playerClass = new Player(user.id);

    const propertyObj = {
        id: 3,
        name: 'Pentagon',
        userId: null,
        houses: 0,
        price: 9001,
        rent: 300,
        collection: 'places',
        owned: false
    };

    mockCtx.prisma.user.findUnique.mockResolvedValue(user);
    mockCtx.prisma.property.findUnique.mockResolvedValue(propertyObj);
    mockCtx.prisma.user.update.mockResolvedValue(user);
    mockCtx.prisma.property.update.mockResolvedValue({...propertyObj, userId: user.id, owned: true});

    let updateProperty = playerClass.buyProperty(propertyObj.id, mockCtx);

    await expect(updateProperty).resolves.toEqual({
        id: 3,
        name: 'Pentagon',
        userId: user.id,
        houses: 0,
        price: 9001,
        rent: 300,
        collection: 'places',
        owned: true
    });
});

test('sell property updates the property properly', async () => {
    const user = {
        id: 804,
        name: 'Player 800',
        money: 11112,
    };

    let playerClass = new Player(user.id);

    const property = {
        id: 805,
        name: 'Pentagon',
        userId: user.id,
        houses: 0,
        price: 9001,
        rent: 300,
        collection: 'places',
        owned: true
    };

    mockCtx.prisma.user.findUnique.mockResolvedValue(user);
    mockCtx.prisma.property.findUnique.mockResolvedValue(property);
    mockCtx.prisma.property.update.mockResolvedValue({...property, userId: null, owned: false});

    let updateProperty = playerClass.sellProperty(property.id, mockCtx);

    await expect(updateProperty).resolves.toEqual({
        id: 805,
        name: 'Pentagon',
        userId: null,
        houses: 0,
        price: 9001,
        rent: 300,
        collection: 'places',
        owned: false
    });
});

test('upDownGradeProperties updates the property properly', async () => {
    const user = {
        id: 900,
        name: 'Plyaer 900',
        money: 10000
    };

    let playerClass = new Player(user.id);

    const property = { 
        id: 901,
        name: 'Area 51',
        userId: user.id,
        houses: 0,
        price: 9000,
        rent: 300,
        collection: 'places',
        owned: true
    };

    mockCtx.prisma.user.findUnique.mockResolvedValue(user);
    mockCtx.prisma.property.findUnique.mockResolvedValue(property);
    mockCtx.prisma.property.update.mockResolvedValue({...property, houses: 2});

    let updateProperty = playerClass.upDownGradeProperty(property.id, 2, mockCtx);

    await expect(updateProperty).resolves.toEqual({ 
        id: 901,
        name: 'Area 51',
        userId: user.id,
        houses: 2,
        price: 9000,
        rent: 300,
        collection: 'places',
        owned: true
    })
});

test('updateMoney updates the player properly when adding money', async () => {
    const user = {
        id: 1000,
        name: 'Player 1000',
        money: 1000
    }

    let playerClass = new Player(user.id);

    let moneyAmount = 100;

    mockCtx.prisma.user.findUnique.mockResolvedValue(user);
    mockCtx.prisma.user.update.mockResolvedValue({...user, money: user.money + 100});

    let updateUser = playerClass.updateMoney(user.id, moneyAmount, mockCtx);

    await expect(updateUser).resolves.toEqual({
        id: 1000,
        name: 'Player 1000',
        money: 1100
    })
});

test('updateMoney updates the player properly when adding money', async () => {
    const user = {
        id: 1000,
        name: 'Player 1000',
        money: 1000
    }

    let playerClass = new Player(user.id);

    let moneyAmount = 100;

    mockCtx.prisma.user.findUnique.mockResolvedValue(user);
    mockCtx.prisma.user.update.mockResolvedValue({...user, money: user.money - 100});

    let updateUser = playerClass.updateMoney(user.id, moneyAmount, mockCtx);

    await expect(updateUser).resolves.toEqual({
        id: 1000,
        name: 'Player 1000',
        money: 900
    })
});