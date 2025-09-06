# [0010. Redis 哈希(Hash)](https://github.com/tnotesjs/TNotes.redis/tree/main/notes/0010.%20Redis%20%E5%93%88%E5%B8%8C(Hash))

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 Redis hash](#2--redis-hash)
- [3. 📒 常用的 redis hash 命令](#3--常用的-redis-hash-命令)
- [4. 💻 基础示例](#4--基础示例)
- [5. 💻 hash 编码方式](#5--hash-编码方式)

<!-- endregion:toc -->

## 1. 📝 概述

- 了解 hash 常用命令
- 了解 redis hash 底层编码方式

## 2. 📒 Redis hash

- Redis hash 是一个 string 类型的 field（字段） 和 value（值） 的映射表，hash 特别适合用于存储对象。
- Redis 中每个 hash 可以存储 $2^{32} - 1$ 键值对（40 多亿）。

## 3. 📒 常用的 redis hash 命令

::: code-group

```bash [删除与判断]
HDEL key field1 [field2]
# 删除一个或多个哈希表字段

HEXISTS key field
# 查看哈希表 key 中，指定的字段是否存在。
```

```bash [获取操作]
HGET key field
# 获取存储在哈希表中指定字段的值。

HGETALL key
# 获取在哈希表中指定 key 的所有字段和值

HKEYS key
# 获取哈希表中的所有字段

HVALS key
# 获取哈希表中所有值。

HMGET key field1 [field2]
# 获取所有给定字段的值
```

```bash [设置操作]
HSET key field value
# 将哈希表 key 中的字段 field 的值设为 value 。

HMSET key field1 value1 [field2 value2 ...]
# 同时将多个 field-value (域-值)对设置到哈希表 key 中。

HSETNX key field value
# 只有在字段 field 不存在时，设置哈希表字段的值。
```

```bash [数值操作]
HINCRBY key field increment
# 为哈希表 key 中的指定字段的整数值加上增量 increment 。

HINCRBYFLOAT key field increment
# 为哈希表 key 中的指定字段的浮点数值加上增量 increment 。
```

```bash [其他]
HLEN key
# 获取哈希表中字段的数量

HSCAN key cursor [MATCH pattern] [COUNT count]
# 迭代哈希表中的键值对。
```

:::

## 4. 💻 基础示例

```bash
# 设置哈希表 user:1000 的字段和值
HSET user:1000 name "Alice" age "25" email "alice@example.com"
# 3 (表示成功设置了 3 个字段)

# 获取哈希表中单个字段的值
HGET user:1000 name
# "Alice"

# 获取哈希表中多个字段的值
HMGET user:1000 name age email
# 1) "Alice"
# 2) "25"
# 3) "alice@example.com"

# 获取哈希表中所有字段和值
HGETALL user:1000
# 1) "name"
# 2) "Alice"
# 3) "age"
# 4) "25"
# 5) "email"
# 6) "alice@example.com"

# 判断字段是否存在
HEXISTS user:1000 age
# (integer) 1 (表示存在)

# 删除一个或多个字段
HDEL user:1000 email
# (integer) 1 (成功删除 email 字段)

HEXISTS user:1000 email
# (integer) 0 (表示不存在)

# 获取哈希表中字段数量
HLEN user:1000
# (integer) 2

# 对字段进行自增操作
HINCRBY user:1000 age 1
# (integer) 26

# 获取所有字段名
HKEYS user:1000
# 1) "name"
# 2) "age"

# 获取所有值
HVALS user:1000
# 1) "Alice"
# 2) "26"

# 使用 HSCAN 迭代哈希表中的字段和值
HSCAN user:1000 0 MATCH * COUNT 10
# 1) "0"
# 2) 1) "name"
#    2) "Alice"
#    3) "age"
#    4) "26"
```

## 5. 💻 hash 编码方式

```bash
HSET user:1000 name "Alice" age "26" gender "female" city "Shanghai" country "China"
# 5

HSCAN user:1000 0 MATCH * COUNT 2
# user:1000: 哈希表键名。
# 0: 初始游标值，表示从头开始扫描。
# MATCH *: 匹配所有字段名（无过滤）。
# COUNT 2: 每次返回最多 2 个字段。

# 1) "0" 👉 下一次迭代应使用的游标值
# 2)  1) "name" 👉 字段 1
#     2) "Alice" 👉 值 1
#     3) "age" 👉 字段 2
#     4) "26" 👉 值 2
#     5) "gender" 👉 字段 3
#     6) "female" 👉 值 3
#     7) "city" 👉 字段 4
#     8) "Shanghai" 👉 值 4
#     9) "country" 👉 字段 5
#    10) "China" 👉 值 5
```

- **🤔 COUNT 有什么用？**
  - `COUNT` 是一个 **提示值**（hint），不是硬性限制。它告诉 Redis “我期望每次返回大约多少个元素”，但 Redis 实现上会根据内部结构优化性能，**可能一次返回比 COUNT 多的数据**，也可能少。
- Redis 的 hash 底层有两种编码方式：

| 编码类型 | 条件 | 特点 |
| --- | --- | --- |
| `ziplist`（压缩列表） | 小对象（默认字段数 < 512 且每个值长度 < 64 字节） | 节省内存，但不支持分批读取 |
| `listpack`（压缩列表） | 小对象 | listpack 是 Redis 从 v5.0 引入的一种新的紧凑编码结构，用于替代旧版的 ziplist（压缩列表）。 |
| `hashtable`（哈希表） | 较大对象 | 支持高效查找、插入、删除，也支持 `HSCAN` 分页 |

- 如果底层是 `ziplist`，Redis **会一次性返回所有内容**，忽略 `COUNT`。
- Redis 在 `listpack` 上不支持增量迭代（即 `HSCAN` 不会分批读取），它会一次性把整个 `hash` 全部内容都返回给你。

---

- **🤔 COUNT 在什么情况下生效？**

| 场景 | COUNT 是否生效 | 说明 |
| --- | --- | --- |
| 数据量小（底层使用 `ziplist`、`listpack`） | ❌ 不生效 | Redis 一次性返回所有字段 |
| 数据量大（底层使用 `hashtable`） | ✅ 生效 | Redis 分批次返回字段，每次约 COUNT 个 |

- **🤔 如何查看当前 hash 的编码方式？**
  - 你可以使用 `OBJECT ENCODING` 命令查看，输出可能是：`"ziplist"`、`"listpack"`、`"hashtable"`

```bash
OBJECT ENCODING user:1000
# "listpack"
```

- **🤔 如何让 COUNT 生效？**
  - 一种比较快捷的方式：插入更多字段或更大的值。
  - Redis 默认在下面情况下会将 hash 编码转换为 hashtable：
    - 字段数超过 `hash-max-ziplist-entries`（默认 512）
    - 或任意一个 value 长度超过 `hash-max-ziplist-value`（默认 64 字节）

```bash
HSET user:1000 bigfield "this is a very long string that exceeds the 64-byte limit and will force Redis to switch to hashtable encoding"
# 1

OBJECT ENCODING user:1000
# "hashtable"

HSCAN user:1000 0 MATCH * COUNT 2
# 1) "4" 👉 下一次迭代应使用的游标值
# 2) 1) "country"
#    2) "China"
#    3) "name"
#    4) "Alice"

HSCAN user:1000 4 MATCH * COUNT 3
# 1) "7" 👉 下一次迭代应使用的游标值
# 2) 1) "bigfield"
#    2) "this is a very long string that exceeds the 64-byte limit and will force Redis to switch to hashtable encoding"
#    3) "age"
#    4) "26"
#    5) "city"
#    6) "Shanghai"

HSCAN user:1000 7 MATCH * COUNT 3
# 1) "0"
# 2) 1) "gender"
  #  2) "female"
```
