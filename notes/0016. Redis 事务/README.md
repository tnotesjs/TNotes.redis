# [0016. Redis 事务](https://github.com/tnotesjs/TNotes.redis/tree/main/notes/0016.%20Redis%20%E4%BA%8B%E5%8A%A1)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 Redis 事务](#2--redis-事务)
- [3. 💻 Redis 事务的基本使用](#3--redis-事务的基本使用)
- [4. 💻 事务执行中命令失败不影响后续命令](#4--事务执行中命令失败不影响后续命令)
- [5. 💻 取消事务](#5--取消事务)
- [6. 💻 使用 `WATCH` 实现乐观锁](#6--使用-watch-实现乐观锁)
- [7. 📒 乐观锁](#7--乐观锁)

<!-- endregion:toc -->

## 1. 📝 概述

- 了解 redis 中事务的基本使用
- 了解“乐观锁”

## 2. 📒 Redis 事务

- Redis 事务可以一次执行多个命令， 并且带有以下三个重要的保证：
  - 批量操作在发送 `EXEC` 命令前被放入队列缓存。
  - 收到 `EXEC` 命令后进入事务执行，事务中任意命令执行失败，其余的命令依然被执行。
  - 在事务执行过程，其他客户端提交的命令请求不会插入到事务执行命令序列中。
- 一个事务从开始到执行会经历以下三个阶段：
  - 开始事务。`MULTI`
  - 命令入队。
  - 执行事务。`EXEC`
- 以 `MULTI` 开始一个事务， 然后将多个命令入队到事务中， 最后由 `EXEC` 命令触发事务， 一并执行事务中的所有命令。
- Redis 的事务不支持回滚（Rollback），即使某个命令执行失败，其余命令仍会继续执行。
- 常用命令：

| 命令      | 描述                 |
| --------- | -------------------- |
| `MULTI`   | 开始一个事务         |
| `EXEC`    | 执行事务中的所有命令 |
| `DISCARD` | 取消事务，清空队列   |
| `WATCH`   | 监视一个或多个键     |

- `WATCH` 用于监视一个或多个键，若事务期间这些键被其他客户端修改，则事务中断，可用于实现乐观锁。

## 3. 💻 Redis 事务的基本使用

```bash
# 开始事务
MULTI
# 添加命令到队列中
SET key1 "Hello"
SET key2 "World"
# 执行事务
EXEC
# 输出结果：
# 1) OK
# 2) OK
```

- 在 `MULTI` 之后的所有命令不会立即执行，而是被放入队列，在 `EXEC` 被调用时一次性全部执行。

## 4. 💻 事务执行中命令失败不影响后续命令

```bash
MULTI
SET a 10
SADD b 10 20 # 错误命令（b 是字符串类型）
INCR a
EXEC
# 输出结果：
# 1) OK
# 2) (error) ERR Operation against a key holding the wrong kind of value
# 3) (integer) 11
```

- 通过这个示例可以了解到，如果批量执行的命令中某个命令出错，后续命令也会被执行。

## 5. 💻 取消事务

```bash
MULTI
SET key3 "value3"
DISCARD
# 输出结果：
OK
```

- 使用 `DISCARD` 后，事务中所有命令都会被丢弃，不会执行。

## 6. 💻 使用 `WATCH` 实现乐观锁

- 【1】使用 `WATCH` 实现乐观锁
- 【2】Node.js 中使用 Redis 实现带重试机制的乐观锁

::: code-group

```bash [1]
# 客户端 1：
SET key4 "value4"
WATCH key4
MULTI
SET key4 "new_value"
EXEC
# 如果 key4 没有被其他客户端修改过，事务会成功

# 客户端 2（在 EXEC 前修改了 key4）：
SET key4 "changed_by_other"

# 输出结果（客户端 1）：
# (nil)
# 表示客户端 1 的事务被打断，未执行任何操作。
# 可以通过重试机制重新执行事务。
```

```js [2]
const redis = require('redis')
const client = redis.createClient()

async function updateKeyWithOptimisticLock(key, newValue) {
  let retries = 0
  const maxRetries = 5

  while (retries < maxRetries) {
    try {
      // 1. 监视 key
      await client.watch(key)

      // 2. 获取当前值（可选，用于业务判断）
      const currentValue = await client.get(key)
      console.log(`当前值: ${currentValue}`)

      // 3. 准备更新（可以加业务判断）
      if (currentValue === null) {
        console.log('键不存在')
        await client.unwatch()
        break
      }

      // 4. 开始事务
      await client.multi()
      await client.set(key, newValue)

      // 5. 提交事务
      const result = await client.exec()

      if (result !== null) {
        console.log('更新成功:', newValue)
        return true
      } else {
        console.log('事务冲突，正在重试...')
        retries++
        continue // 重试
      }
    } catch (err) {
      console.error('发生错误:', err)
      await client.unwatch()
      break
    }
  }

  console.log('更新失败或已达到最大重试次数')
  return false
}

// 调用示例
updateKeyWithOptimisticLock('key4', 'new_value')
```

:::

- key4 的初始值是 value4，然后监听 key4，如果在 `MULTI` 到执行 `EXEC` 这段时间内，key4 没有被其它客户端修改，那么 key4 将被设置为 new_value。
- 你可以把 WATCH + MULTI + EXEC 看作是一个“带条件的原子操作”。
- “我现在要修改 key4，但我希望在我决定改之前没人动过它。如果没人动，我就改；如果有人动了，我就不改。”
- **乐观锁是一种无锁策略，适用于读多写少、冲突较少的场景，通过在提交操作前检查数据是否被修改来保证一致性，常用于高并发系统中。**

## 7. 📒 乐观锁

- **乐观锁（Optimistic Lock）**
  - 乐观锁是一种并发控制机制，它的核心思想是：**假设大多数情况下不会发生并发冲突，只在提交更新时检查是否违反数据一致性。**
  - 如果检测到冲突（比如某个数据在你读取后、修改前被别人改过了），就拒绝操作并提示重试。
- 典型应用场景

| 场景           | 描述                                           |
| -------------- | ---------------------------------------------- |
| **库存扣减**   | 下单时先查库存，再扣库存。用乐观锁防止超卖。   |
| **计数器更新** | 如点赞数、访问量统计，避免并发写入错误。       |
| **配置更新**   | 多个服务同时尝试更新配置项，确保只有一个成功。 |
| **表单提交**   | 在 Web 应用中防止用户重复提交或并发编辑冲突。  |

- 举例说明：库存扣减（电商系统）
  1. 用户 A 查询商品库存为 1；
  2. 用户 B 同时也查询到库存为 1；
  3. 用户 A 提交订单，将库存减为 0，并使用乐观锁确保没有其他人同时改了库存；
  4. 用户 B 再次提交时发现库存已被修改，事务失败，提示“库存不足”。
- **🤔 为什么叫“乐观锁”？**
  - 因为它对并发操作持“乐观”态度，认为：
    - 多数时候不会有多个线程或客户端同时修改同一份数据；
    - 所以不需要一开始就加锁（如悲观锁），而是在最后提交时才做一次检查。
  - 就像两个人都想改一个文件，系统说：“你们都拿去改吧，但等下提交的时候只能一个人成功。”
- **Redis 中的乐观锁实现：`WATCH`**
  - 在 Redis 中，使用 `WATCH key` 来监视一个或多个键，表示：
    - 如果事务执行期间这些键被其他客户端修改过，则整个事务不会执行（返回 nil）。
    - 否则事务正常执行。
  - 这非常适合用于分布式场景下的原子性更新判断。
