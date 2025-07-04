# [0010. Redis 哈希(Hash)](https://github.com/Tdahuyou/TNotes.redis/tree/main/notes/0010.%20Redis%20%E5%93%88%E5%B8%8C(Hash))

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 常用的 redis hash 命令](#2--常用的-redis-hash-命令)
- [3. 💻 基础示例](#3--基础示例)

<!-- endregion:toc -->

## 1. 📝 概述

- Redis hash 是一个 string 类型的 field（字段） 和 value（值） 的映射表，hash 特别适合用于存储对象。
- Redis 中每个 hash 可以存储 $2^{32} - 1$ 键值对（40 多亿）。

## 2. 📒 常用的 redis hash 命令

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

## 3. 💻 基础示例

```bash
# 设置哈希表 user:1000 的字段和值
HSET user:1000 name "Alice" age "25" email "alice@example.com"
# OK (表示成功设置)

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
