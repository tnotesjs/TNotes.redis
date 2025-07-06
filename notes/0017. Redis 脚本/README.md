# [0017. Redis 脚本](https://github.com/Tdahuyou/TNotes.redis/tree/main/notes/0017.%20Redis%20%E8%84%9A%E6%9C%AC)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 Redis 脚本](#2--redis-脚本)
- [3. 📒 常用的 Redis 脚本命令](#3--常用的-redis-脚本命令)
- [4. 💻 EVAL 基本使用（返回 KEYS 和 ARGV）](#4--eval-基本使用返回-keys-和-argv)
- [5. 💻 使用 Lua 脚本实现计数器（原子自增）](#5--使用-lua-脚本实现计数器原子自增)
  - [5.1. 场景描述](#51-场景描述)
  - [5.2. 传统方式和 Lua 脚本方式的代码实现](#52-传统方式和-lua-脚本方式的代码实现)
  - [5.3. 传统方式存在的问题](#53-传统方式存在的问题)
  - [5.4. Lua 脚本的“原子性”](#54-lua-脚本的原子性)
  - [5.5. 【传统 Redis 命令】和【Lua 脚本】的差异对比](#55-传统-redis-命令和lua-脚本的差异对比)
  - [5.6. 其它类似场景](#56-其它类似场景)
  - [5.7. 小结 - 更复杂的业务场景（Lua 才是王道）](#57-小结---更复杂的业务场景lua-才是王道)
- [6. 💻 使用 SCRIPT LOAD 和 EVALSHA 缓存脚本](#6--使用-script-load-和-evalsha-缓存脚本)
- [7. 💻 检查某个键是否存在，如果存在则设置值（类似 `SETNX`）](#7--检查某个键是否存在如果存在则设置值类似-setnx)
- [8. 💻 批量删除匹配模式的键（如 keys `session:`）](#8--批量删除匹配模式的键如-keys-session)

<!-- endregion:toc -->

## 1. 📝 概述

- 了解 Redis 脚本的基本使用。

## 2. 📒 Redis 脚本

- Redis 脚本使用 Lua 解释器来执行脚本。
- Redis 2.6 版本通过内嵌支持 Lua 环境。执行脚本的常用命令为 EVAL。
- Eval 命令的基本语法如下：

```bash
EVAL script numkeys key [key ...] arg [arg ...]

# Example：
EVAL "return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}" 2 key1 key2 first second
# 1) "key1"
# 2) "key2"
# 3) "first"
# 4) "second"
```

- Lua 脚本的优势

| 优势            | 描述                                        |
| --------------- | ------------------------------------------- |
| 🔐 原子性       | 多个 Redis 命令打包成一个脚本，保证原子执行 |
| ⚡ 减少网络往返 | 多条命令只需一次请求                        |
| 🧩 可复用       | 使用 `SCRIPT LOAD` + `EVALSHA` 提高性能     |
| 📦 逻辑控制     | 支持 if/else、循环、函数等复杂逻辑          |

## 3. 📒 常用的 Redis 脚本命令

```bash
# 执行 Lua 脚本。
EVAL script numkeys key [key ...] arg [arg ...]

# 执行 Lua 脚本。
EVALSHA sha1 numkeys key [key ...] arg [arg ...]

# 查看指定的脚本是否已经被保存在缓存当中。
SCRIPT EXISTS script [script ...]

# 从脚本缓存中移除所有脚本。
SCRIPT FLUSH

# 杀死当前正在运行的 Lua 脚本。
SCRIPT KILL

# 将脚本 script 添加到脚本缓存中，但并不立即执行这个脚本。
SCRIPT LOAD script
```

## 4. 💻 EVAL 基本使用（返回 KEYS 和 ARGV）

```bash
# 脚本返回传入的键和参数
EVAL "return {KEYS[1], KEYS[2], ARGV[1], ARGV[2]}" 2 key1 key2 value1 value2
# 1) "key1"
# 2) "key2"
# 3) "value1"
# 4) "value2"
```

- `KEYS` 是传入的键列表；
- `ARGV` 是额外的参数列表；
- `2` 表示传入了两个键（`key1`, `key2`）；

## 5. 💻 使用 Lua 脚本实现计数器（原子自增）

- 通过一个点赞的需求场景，来了解 lua 脚本和传统 redis 命令之间的差异。

### 5.1. 场景描述

- 场景：**一个用户每天只能点赞一次的计数器系统**
- 你希望实现以下功能：
- 用户 `user:1001` 对文章 `article:2001` 点赞；
- 如果今天还没点过，就增加点赞数，并记录已点赞；
- 如果今天已经点过，则不重复加分。

### 5.2. 传统方式和 Lua 脚本方式的代码实现

::: code-group

```bash [传统方式（多个 Redis 命令）]
# 检查是否今天已经点赞
GET user:1001:liked:article:2001
# 结果为 nil → 表示没有点过赞

# 设置点赞状态
SET user:1001:liked:article:2001 "1"

# 增加文章点赞数
INCR article:2001:likes
```

```bash [使用 Lua 脚本方式（原子性更强）]
EVAL "
if redis.call('GET', KEYS[1]) == nil then
    redis.call('SET', KEYS[1], '1')
    return redis.call('INCR', KEYS[2])
else
    return 0
end
" 2 user:1001:liked:article:2001 article:2001:likes
```

:::

### 5.3. 传统方式存在的问题

- 传统方式在单线程下没问题，但在高并发下就会出现严重问题！
- 并发冲突示例：

| 时间 | 客户端 A            | 客户端 B            |
| ---- | ------------------- | ------------------- |
| T1   | GET → nil（未点赞） |                     |
| T2   |                     | GET → nil（未点赞） |
| T3   | INCR                | INCR                |

最终结果是：

- `article:2001:likes` 变成了 `2`，但实际上两个客户端都执行了点赞；
- 规则是“每天只能点赞一次”，而这里记了两次，那就出错了 ❌

### 5.4. Lua 脚本的“原子性”

这段 Lua 脚本的含义是：

- 如果没点赞过：
  - 设置已点赞标志；
  - 增加点赞数；
  - 返回新的点赞数；
- 如果已经点过赞：
  - 返回 0，表示不能重复点赞；

而且这个操作是 **原子性的**，不会被其他客户端打断。

### 5.5. 【传统 Redis 命令】和【Lua 脚本】的差异对比

| 特性 | 传统方式（多条命令） | Lua 脚本方式 |
| --- | --- | --- |
| 是否具备原子性 | ❌ 否 | ✅ 是 |
| 是否适合复杂逻辑判断 | ❌ 难以控制 | ✅ 支持 if/else、循环、函数等完整逻辑 |
| 是否支持事务组合 | ❌ 需要用 MULTI/EXEC | ✅ 内置原子性，无需额外事务机制 |
| 是否能在分布式环境下安全运行 | ❌ 易受干扰 | ✅ 在 Redis 单机 / Sentinel / Cluster 下可控 |
| 是否易于复用 | ❌ 多次网络请求 | ✅ 可缓存脚本（SCRIPT LOAD + EVALSHA） |
| 性能表现 | ❌ 多次往返 | ✅ 单次请求完成所有逻辑 |

### 5.6. 其它类似场景

- 类似的场景还有很多，比如假设你要实现如下逻辑：“用户下单前检查库存，如果库存 > 0，就减库存并创建订单。”

```bash
# 如果使用传统 Redis 命令的方式，这需要至少两条 Redis 命令：
GET inventory
DECR inventory
# 但这两步之间可能会有并发写入问题。
```

```bash
# 用 Lua 脚本就可以完美解决：
EVAL "
local stock = redis.call('GET', KEYS[1])
if tonumber(stock) > 0 then
    redis.call('DECR', KEYS[1])
    redis.call('RPUSH', KEYS[2], ARGV[1])
    return 1
else
    return 0
end
" 2 inventory_key orders_list order_id
# 这样整个逻辑就是原子的，要么全部成功，要么失败。
```

### 5.7. 小结 - 更复杂的业务场景（Lua 才是王道）

- Redis 在执行 Lua 脚本时会阻塞其他所有命令，直到脚本执行完毕。这意味着整个脚本中的所有 Redis 操作都会被当作一个整体来执行，不会被其他客户端中断。
- 你可以把 Lua 脚本想象成是一个带锁的函数：“我现在要获取某个键的值，计算新值，并设置回去，这一整套动作不允许任何人打断。”
- 传统的多个 Redis 命令就像没有锁的函数，可能被打断、被插队。
- Redis 的单线程特性 + Lua 脚本保证了整个操作的 **原子性**，即使在高并发下也能确保数据一致性。
- 对于简单自增这类单一原子命令就能搞定的场景，确实不需要 Lua 脚本；但对于涉及多个键、条件判断、流程控制的业务逻辑，Lua 脚本才是保障数据一致性和并发安全的最佳选择。

## 6. 💻 使用 SCRIPT LOAD 和 EVALSHA 缓存脚本

```bash
SET key1 "value1"

# 加载脚本到缓存
SCRIPT LOAD "return redis.call('GET', KEYS[1])"

# 假设返回的 SHA 是 "86f7e437faa5a7fce15d1ddcb9eaeaea35782b59"

# 使用 EVALSHA 执行脚本
EVALSHA 86f7e437faa5a7fce15d1ddcb9eaeaea35782b59 1 key1
# 输出结果：
# "value1"
```

- 如果你经常执行同一个脚本，可以先将其加载到缓存中，后续使用 SHA 标识符调用。
- `SCRIPT LOAD` 将脚本保存在 Redis 内部缓存中；
- `EVALSHA` 可以通过 SHA 来重复调用该脚本，提高性能并减少网络传输。

## 7. 💻 检查某个键是否存在，如果存在则设置值（类似 `SETNX`）

```bash
# 使用 Lua 脚本实现 SETNX 功能
EVAL "if redis.call('GET', KEYS[1]) == false then redis.call('SET', KEYS[1], ARGV[1]); return 1; else return 0; end" 1 lock_key my_value
# 输出结果（第一次运行）：
(integer) 1
# 输出结果（第二次运行）：
(integer) 0
```

- 这个脚本实现了类似 `SETNX` 的功能，但更灵活，可扩展支持 `TTL` 等逻辑。

## 8. 💻 批量删除匹配模式的键（如 keys `session:`）

```bash
# 添加几个测试键
SET session:user:1001 "abc"
SET session:user:1002 "def"
SET session:user:1003 "ghi"

KEYS session:user:*
# 1) "session:user:1002"
# 2) "session:user:1003"
# 3) "session:user:1001"

# 使用 Lua 脚本删除所有 session:user:* 键
EVAL "local keys = redis.call('keys', 'session:user:*'); for i=1,#keys do redis.call('del', keys[i]); end; return #keys;" 0
# 输出结果：
(integer) 3
# 说明成功删除了 3 个键

KEYS session:user:*
# (empty array)
```

- 注意：`KEYS` 操作在大数据量时会影响性能，生产环境建议使用 `SCAN` 替代。
