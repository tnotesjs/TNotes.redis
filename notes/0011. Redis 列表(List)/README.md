# [0011. Redis 列表(List)](https://github.com/Tdahuyou/TNotes.redis/tree/main/notes/0011.%20Redis%20%E5%88%97%E8%A1%A8(List))

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 常用的 redis list 命令](#2--常用的-redis-list-命令)
- [3. 💻 基础示例](#3--基础示例)

<!-- endregion:toc -->

## 1. 📝 概述

- Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）。
- 一个列表最多可以包含 $2^{32} - 1$ 个元素 (4294967295, 每个列表超过 40 亿个元素)。

## 2. 📒 常用的 redis list 命令

::: code-group

```bash [插入与弹出]
LPUSH key value1 [value2]
# 将一个或多个值插入到列表头部

RPUSH key value1 [value2]
# 在列表中添加一个或多个值到列表尾部

LPOP key
# 移出并获取列表的第一个元素

RPOP key
# 移除列表的最后一个元素，返回值为移除的元素。
```

```bash [阻塞操作]
BLPOP key1 [key2 ...] timeout
# 移出并获取列表的第一个元素，如果列表为空则阻塞等待，直到超时或有元素可弹出。

BRPOP key1 [key2 ...] timeout
# 移出并获取列表的最后一个元素，如果列表为空则阻塞等待，直到超时或有元素可弹出。
```

```bash [列表操作]
LRANGE key start stop
# 获取列表指定范围内的元素

LINDEX key index
# 通过索引获取列表中的元素

LREM key count value
# 移除列表中与 value 相等的元素，count 表示移除的个数

LTRIM key start stop
# 对列表进行修剪，只保留指定区间内的元素
```

```bash [高级操作]
LSET key index value
# 通过索引设置列表元素的值

LINSERT key BEFORE|AFTER pivot value
# 在列表的某个元素前或后插入新元素

RPUSHX key value
# 为已存在的列表添加值到尾部

LPUSHX key value
# 为已存在的列表添加值到头部

RPOPLPUSH source destination
# 移除 source 列表的最后一个元素，并将其添加到 destination 列表头部，返回该元素

BRPOPLPUSH source destination timeout
# 阻塞版本的 RPOPLPUSH，若 source 列表为空则等待，直到超时或有元素可弹出
```

```bash [其他]
LLEN key
# 获取列表长度
```

:::

## 3. 💻 基础示例

```bash
# 插入元素到列表头部
LPUSH mylist "hello"
# (integer) 1

LPUSH mylist "world"
# (integer) 2

# 查看列表范围
LRANGE mylist 0 -1
# 1) "world"
# 2) "hello"

# 弹出第一个元素
LPOP mylist
# "world"

# 查看剩余元素
LRANGE mylist 0 -1
# 1) "hello"

# 插入元素到尾部
RPUSH mylist "redis"
# (integer) 2

# 查看列表
LRANGE mylist 0 -1
# 1) "hello"
# 2) "redis"

# 设置指定索引位置的值
LSET mylist 1 "database"
# OK

# 查看更新后的列表
LRANGE mylist 0 -1
# 1) "hello"
# 2) "database"

# 删除指定值（删除一个 "hello"）
LREM mylist 1 "hello"
# (integer) 1

# 查看剩余元素
LRANGE mylist 0 -1
# 1) "database"

# 获取列表长度
LLEN mylist
# (integer) 1

# 阻塞弹出（演示命令，实际执行需在不同客户端操作）
BLPOP anotherlist 10
# 如果 anotherlist 为空，则阻塞最多 10 秒

# 列表修剪：只保留索引 0 到 1 的元素
LTRIM mylist 0 1
# OK
```
