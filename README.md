# 简介

- 该工具用来获取一个 redis client 实例，内部实现单例模式，一个项目中只会保持一个连接，避免连接数过多的问题

- 连接异常的情况下，会自动重连

- 依赖 bluebird, 同时支持 callback 回调和 promise 两种形式

# 安装

`npm install @newhope/redisClient --save`

# 引用

```
const redisConfig = {
    host: '127.0.0.1',
    port: '6379'
};

const redisClient = require('@newhope/redisClient')(redisConfig);
```

# callback 方式

```
redisClient.select(1);

redisClient.set('foo', 'bar', err=>{
    if(!err){
        redisClient.get('foo', (err, result)=>{
            console.log(result);
        });
    }
});

//bar
```

# promise 方式

```
redisClient.select(1);

redisClient.setAsync('foo', 'bar').then(()=>redisClient.getAsync('bar')).then(res=>console.log(res));

//bar
```