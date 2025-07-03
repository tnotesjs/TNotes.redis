# [0008. Redis 键(key)](https://github.com/Tdahuyou/TNotes.redis/tree/main/notes/0008.%20Redis%20%E9%94%AE(key))

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 常用的 redis 键命令](#2--常用的-redis-键命令)
- [3. 💻 基础示例](#3--基础示例)

<!-- endregion:toc -->

## 1. 📝 概述

- Redis 键命令用于管理 redis 的键。

## 2. 📒 常用的 redis 键命令

::: code-group

```bash [键管理]
SET KEY_NAME VALUE
# 设置键 KEY_NAME 的值为 VALUE

GET KEY_NAME
# 获取键 KEY_NAME 的值

DEL KEY_NAME
# 删除键 KEY_NAME
# DEL 是 DELETE 的缩写，表示删除

EXISTS KEY_NAME
# 检查键 KEY_NAME 是否存在

RENAME KEY NEWKEY
# 将键 KEY 的值重命名为 NEWKEY。

RENAMENX KEY NEWKEY
# 将键 KEY 的值重命名为 NEWKEY。（前提：如果 NEWKEY 不存在）
# RENAMENX 是 Rename if Not eXists 的缩写，仅在新键不存在时重命名

TYPE KEY
# 返回键 KEY 的数据类型。

DUMP KEY_NAME
# 获取键 KEY_NAME 的数据，会返回被序列化的值。

MOVE KEY DB
# 将当前数据库的 KEY 移动到指定的数据库 DB 中
```

```bash [过期时间管理]
TTL KEY
# 获取键 KEY 的剩余过期时间，单位为秒。
# TTL 表示 Time To Live，即键 KEY 的剩余生存时间。

PTTL KEY
# 获取键 KEY 的剩余过期时间，单位为毫秒。
# PTTL 是 Precise Time To Live 的缩写，表示键的剩余生存时间（毫秒）

EXPIRE KEY_NAME TIME
# 设置键 KEY_NAME 的过期时间，TIME 为秒数。

EXPIREAT KEY_NAME TIMESTAMP
# 设置键 KEY_NAME 的过期时间，TIMESTAMP 为时间戳。

PEXPIRE KEY_NAME MILLISECONDS
# 毫秒级设置键 KEY_NAME 的过期时间，MILLISECONDS 为毫秒数。
# PEXPIRE 是 Precise Expire 的缩写，毫秒级设置过期时间

PEXPIREAT KEY_NAME TIMESTAMP
# 毫秒级设置键 KEY_NAME 的过期时间，TIMESTAMP 为时间戳。
# PEXPIREAT 是 Precise Expire At 的缩写，毫秒级设置精确过期时间点

PERSIST KEY
# 删除键 KEY 的过期时间，KEY 将持久保存。
```

```bash [其他]
KEYS PATTERN
# 获取所有匹配 PATTERN 的键
# 比如 KEYS *
# 表示获取所有键

RANDOMKEY
# 从当前数据库中随机返回一个 KEY。

SCAN CURSOR [MATCH pattern] [COUNT count]
# 迭代当前数据库中的键。
# 比如 SCAN 0 MATCH * COUNT 10
# 表示从索引 0 开始，每次迭代返回 10 个键。
```

:::

## 3. 💻 基础示例

```bash
SET a 1 b 2 # 设置键 a 和 b 的值分别为 1 和 2
# OK (表示成功设置键 a 和 b 的值分别为 1 和 2)

GET a # 获取键 a 的值
# "1" (获取键 a 的值)

GET b # 获取键 b 的值
# "2" (获取键 b 的值)

EXISTS a b # 检查键 a 和 b 是否存在
# (integer) 2 (表示两个键都存在)

DEL a b # 删除键 a 和 b
# (integer) 2 (成功删除了两个键)
```
