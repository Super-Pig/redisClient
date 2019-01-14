const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let redisClient = null;

module.exports = ({
    host = '127.0.0.1',
    port = '6379',
    password = ''
}) => {
    if (!redisClient) {
        redisClient = redis.createClient(Object.assign({
            host,
            port,
            password,
            retry_strategy: function (options) {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    // End reconnecting on a specific error and flush all commands with
                    // a individual error
                    return new Error('Redis server refused the connection');
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands
                    // with a individual error
                    return new Error('Redis retry connecting time exhausted');
                }
                if (options.attempt > 10) {
                    // End reconnecting with built in error
                    return undefined;
                }

                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            }
        }));

        redisClient.on("error", function (err) {
            console.log("Redis Error:" + err);
        });

        redisClient.quit = (callback = () => {}) => callback();
        redisClient.quitAsync = Promise.resolve();    
    }

    return redisClient;
};