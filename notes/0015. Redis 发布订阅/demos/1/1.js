const redis = require('redis')

// 创建订阅者客户端
const subscriber = redis.createClient()

/* 相当于使用以下默认参数创建订阅者客户端：
const subscriber = redis.createClient({
  host: '127.0.0.1',     // Redis 服务器地址
  port: 6379,            // Redis 端口
  password: '',          // 认证密码（如果没有可留空）
  database: 0,           // 使用的数据库编号
});
*/

// 创建发布者客户端
const publisher = redis.createClient()

// 订阅频道名称
const CHANNEL_NAME = 'myChannel'

// 连接客户端
;(async () => {
  try {
    // 连接订阅者与发布者
    await subscriber.connect()
    console.log('订阅者已连接')

    await publisher.connect()
    console.log('发布者已连接')

    // 订阅者先订阅频道
    await subscriber.subscribe(CHANNEL_NAME, (message) => {
      console.log(`收到消息 [${CHANNEL_NAME}]: ${message}`)
    })

    console.log(`等待订阅频道 "${CHANNEL_NAME}" 的消息...`)

    // 发布者发布测试消息
    let i = 0
    setInterval(() => {
      publisher.publish(CHANNEL_NAME, `Hello from publisher! - ${i++}`)
    }, 1000)
  } catch (err) {
    console.error('连接或订阅失败:', err)
  }
})()

/* 
前提：确保 redis-server 正在运行

启动：node 1.js

输出：
订阅者已连接
发布者已连接
等待订阅频道 "myChannel" 的消息...
收到消息 [myChannel]: Hello from publisher! - 0
收到消息 [myChannel]: Hello from publisher! - 1
收到消息 [myChannel]: Hello from publisher! - 2
收到消息 [myChannel]: Hello from publisher! - 3
收到消息 [myChannel]: Hello from publisher! - 4
收到消息 [myChannel]: Hello from publisher! - 5
收到消息 [myChannel]: Hello from publisher! - 6
……
*/
