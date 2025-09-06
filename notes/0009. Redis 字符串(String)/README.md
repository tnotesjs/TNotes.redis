# [0009. Redis 字符串(String)](<https://github.com/Tdahuyou/TNotes.redis/tree/main/notes/0009.%20Redis%20%E5%AD%97%E7%AC%A6%E4%B8%B2(String)>)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 常用的 redis 字符串命令](#2--常用的-redis-字符串命令)
- [3. 💻 基础示例](#3--基础示例)
- [4. 🔗 References](#4--references)

<!-- endregion:toc -->

## 1. 📝 概述

- Redis 字符串数据类型的相关命令用于管理 redis 字符串值。

## 2. 📒 常用的 redis 字符串命令

::: code-group

```bash [基础操作]
SET key value
# 设置指定 key 的值

GET key
# 获取指定 key 的值

STRLEN key
# 返回 key 所储存的字符串值的长度

APPEND key value
# 如果 key 已经存在并且是一个字符串，将 value 追加到该 key 原来值的末尾
```

```bash [多键操作]
MSET key value [key value ...]
# 同时设置一个或多个 key-value 对

MGET key1 [key2...]
# 获取所有给定 key 的值

MSETNX key value [key value ...]
# 同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在
```

```bash [条件设置]
SETNX key value
# 只有在 key 不存在时才设置 key 的值

SETEX key seconds value
# 将值 value 关联到 key，并将 key 的过期时间设为 seconds（以秒为单位）

PSETEX key milliseconds value
# 类似于 SETEX，但以毫秒为单位设置 key 的生存时间
```

```bash [位操作]
GETBIT key offset
# 获取 key 所储存字符串值在指定偏移量上的位(bit)

SETBIT key offset value
# 设置或清除 key 所储存字符串值在指定偏移量上的位(bit)
```

```bash [数值操作]
INCR key
# 将 key 中储存的数字值增一

INCRBY key increment
# 将 key 所储存的值加上给定的增量值

INCRBYFLOAT key increment
# 将 key 所储存的值加上给定的浮点数增量

DECR key
# 将 key 中储存的数字值减一

DECRBY key decrement
# 将 key 所储存的值减去给定的减量值
```

```bash [其他]
GETRANGE key start end
# 返回 key 中字符串值的子字符

GETSET key value
# 将 key 的值设为新值，并返回旧值

SETRANGE key offset value
# 用 value 覆写 key 所储存的字符串值，从偏移量 offset 开始
```

:::

## 3. 💻 基础示例

```bash
# 设置 key 的值
SET greeting "hello"

# 获取 key 的值
GET greeting # 输出 "hello"

# 获取字符串长度
STRLEN greeting # 输出 5

# 追加字符串
APPEND greeting " world" # 现在值为 "hello world"
GET greeting # 输出 "hello world"

# 获取部分字符串
GETRANGE greeting 0 4 # 输出 "hello"

# 获取并设置
GETSET greeting "hi" # 返回旧值 "hello world"
GET greeting # 输出新值 "hi"

# 条件设置
SETNX new_key "first_set" # 1 表示设置成功
SETNX new_key "second_set" # 0 表示设置失败，不会覆盖，因为 new_key 已存在

# 多个键设置与获取
MSET name "Alice" age "30"
MGET name age
# 1) "alice"
# 2) "30"

# 自增操作
SET counter 100
INCR counter # 输出 101
INCRBY counter 10 # 输出 111

# 自减操作
DECR counter # 输出 110
DECRBY counter 5 # 输出 105

# 位操作
SET bit_key "A" # ASCII 'A' = 65 = 0b01000001
GETBIT bit_key 0 # 输出 0
GETBIT bit_key 1 # 输出 1
GETBIT bit_key 2 # 输出 0
GETBIT bit_key 3 # 输出 0
GETBIT bit_key 4 # 输出 0
GETBIT bit_key 5 # 输出 0
GETBIT bit_key 6 # 输出 0
GETBIT bit_key 7 # 输出 1

SETBIT bit_key 2 1 # 修改第 3 位为 1 -> 0b01100001
GET bit_key # ASCII 'a' (0b01100001)
# a
```

## 4. 🔗 References

- https://www.runoob.com/w3cnote/ascii.html
  - 菜鸟教程 ASCII 表
  - ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-09-33-09.png)
