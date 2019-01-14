const redisConfig = {
    host: '127.0.0.1',
    port: '6379'
};

const redisClient = require('../index')(redisConfig);

redisClient.select(1);

redisClient.setAsync('foo', 'bar').then(() => {
    return redisClient.getAsync('foo');
}).then(res => {
    console.log(res);
});