# [0008. Redis 键(key)](https://github.com/Tdahuyou/TNotes.redis/tree/main/notes/0008.%20Redis%20%E9%94%AE(key))

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 常见命令](#2--常见命令)
- [3. 💻 基础示例](#3--基础示例)

<!-- endregion:toc -->

## 1. 📝 概述

- Redis 键命令用于管理 redis 的键。
- Redis 键命令的基本语法如下：

```bash
COMMAND KEY_NAME
```

## 2. 📒 常见命令

```bash
DEL KEY_NAME
# 删除键 KEY_NAME

DUMP KEY_NAME
# 获取键 KEY_NAME 的数据，会返回被序列化的值。

EXISTS KEY_NAME
# 检查键 KEY_NAME 是否存在

EXPIRE KEY_NAME TIME
# 设置键 KEY_NAME 的过期时间，TIME 为秒数。

EXPIREAT KEY_NAME TIMESTAMP
# 设置键 KEY_NAME 的过期时间，TIMESTAMP 为时间戳。

PEXPIRE KEY_NAME MILLISECONDS
# 毫秒级设置键 KEY_NAME 的过期时间，MILLISECONDS 为毫秒数。

PEXPIREAT KEY_NAME TIMESTAMP
# 毫秒级设置键 KEY_NAME 的过期时间，TIMESTAMP 为时间戳。

KEYS PATTERN
# 获取所有匹配 PATTERN 的键

```

## 3. 💻 基础示例

```bash
SET a 1 b 2 # 设置键 a 和 b 的值分别为 1 和 2
GET a # 获取键 a 的值
GET b # 获取键 b 的值
EXISTS a b # 检查键 a 和 b 是否存在
DEL a b # 删除键 a 和 b
```
