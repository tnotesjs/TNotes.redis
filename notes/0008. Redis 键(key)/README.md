# [0008. Redis 键(key)](https://github.com/tnotesjs/TNotes.redis/tree/main/notes/0008.%20Redis%20%E9%94%AE(key))

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 常用的 redis 键命令](#2--常用的-redis-键命令)
- [3. 💻 key](#3--key)

<!-- endregion:toc -->

## 1. 📝 概述

- Redis 键命令用于管理 redis 的键。

## 2. 📒 常用的 redis 键命令

- 【1】基础操作
- 【2】过期时间管理
- 【3】其他

::: code-group

```bash [1]
# 设置键 KEY_NAME 的值为 VALUE
SET KEY_NAME VALUE

# 获取键 KEY_NAME 的值
GET KEY_NAME

# 删除键 KEY_NAME
DEL KEY_NAME
# DEL 是 DELETE 的缩写，表示删除

# 检查键 KEY_NAME 是否存在
EXISTS KEY_NAME

# 将键 KEY 的值重命名为 NEWKEY。
RENAME KEY NEWKEY

# 将键 KEY 的值重命名为 NEWKEY。（前提：如果 NEWKEY 不存在）
RENAMENX KEY NEWKEY
# RENAMENX 是 Rename if Not eXists 的缩写，仅在新键不存在时重命名

# 删除当前数据库的所有 key
FLUSHDB

# 删除所有数据库的所有 key
FLUSHALL

# 获取当前数据库的 key 数量
DBSIZE

TYPE KEY
# 返回键 KEY 的数据类型。

DUMP KEY_NAME
# 获取键 KEY_NAME 的数据，会返回被序列化的值。

MOVE KEY DB
# 将当前数据库的 KEY 移动到指定的数据库 DB 中
```

```bash [2]
# 获取键 KEY 的剩余过期时间，单位为秒。
TTL KEY
# TTL 表示 Time To Live，即键 KEY 的剩余生存时间。

# 获取键 KEY 的剩余过期时间，单位为毫秒。
PTTL KEY
# PTTL 是 Precise Time To Live 的缩写，表示键的剩余生存时间（毫秒）

# 设置键 KEY_NAME 的过期时间，TIME 为秒数。
EXPIRE KEY_NAME TIME

# 设置键 KEY_NAME 的过期时间，TIMESTAMP 为时间戳。
EXPIREAT KEY_NAME TIMESTAMP

# 毫秒级设置键 KEY_NAME 的过期时间，MILLISECONDS 为毫秒数。
PEXPIRE KEY_NAME MILLISECONDS
# PEXPIRE 是 Precise Expire 的缩写，毫秒级设置过期时间

# 毫秒级设置键 KEY_NAME 的过期时间，TIMESTAMP 为时间戳。
PEXPIREAT KEY_NAME TIMESTAMP
# PEXPIREAT 是 Precise Expire At 的缩写，毫秒级设置精确过期时间点

# 删除键 KEY 的过期时间，KEY 将持久保存。
PERSIST KEY
```

```bash [3]
# 获取所有匹配 PATTERN 的键
KEYS PATTERN
# 比如 KEYS *
# 表示获取所有键

# 从当前数据库中随机返回一个 KEY。
RANDOMKEY

# 迭代当前数据库中的键。
SCAN CURSOR [MATCH pattern] [COUNT count]
# 比如 SCAN 0 MATCH * COUNT 10
# 表示从索引 0 开始，每次迭代返回 10 个键。
```

:::

## 3. 💻 key

```bash
SET a 1  # 设置键 a 为 1
# OK (表示成功)

SET b 2 # 设置键 b 为 2
# OK (表示成功)

TYPE a
# string (表示键 a 的类型为字符串)

TYPE b
# string (表示键 b 的类型为字符串)

GET a # 获取键 a 的值
# "1" (获取键 a 的值)

GET b # 获取键 b 的值
# "2" (获取键 b 的值)

DUMP b
# "\x00\xc0\x02\x0c\x00D\xd4\x84|\x02\xfe\xe0\x82"
# 获取 b 被序列化的值

EXISTS a b # 检查键 a 和 b 是否存在
# (integer) 2 (表示两个键都存在)

RANDOMKEY
# "a" 或 "b" 其中一个

DEL a b # 删除键 a 和 b
# (integer) 2 (成功删除了两个键)

EXISTS a b
# (integer) 0 (表示两个键都不存在)

GET a
# (nil)

GET b
# (nil)
```
