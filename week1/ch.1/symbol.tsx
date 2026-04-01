const isSymbol: symbol = Symbol('symbol');

const user = {
    name: '요나',
    [isSymbol]: '비밀정보예요',
};

console.log(user.name);
console.log(user[isSymbol]);
console.log(Object.keys(user));