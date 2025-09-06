# [0012. Redis 集合(Set)](https://github.com/tnotesjs/TNotes.redis/tree/main/notes/0012.%20Redis%20%E9%9B%86%E5%90%88(Set))

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 Set 集合](#2--set-集合)
- [3. 📒 常用的 redis set 命令](#3--常用的-redis-set-命令)
- [4. 💻 基础示例](#4--基础示例)

<!-- endregion:toc -->

## 1. 📝 概述

- 了解 redis 中的 set 集合的相关命令

## 2. 📒 Set 集合

- Redis 的 Set 是 String 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据。
- 集合对象的编码可以是 intset 或者 hashtable。
- Redis 中集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。
- 集合中最大的成员数为 $2^{32} - 1$ (4294967295, 每个集合可存储 40 多亿个成员)。

## 3. 📒 常用的 redis set 命令

::: code-group

```bash [集合操作]
SADD key member1 [member2 ...]
# 向集合中添加一个或多个成员

SREM key member1 [member2 ...]
# 移除集合中的一个或多个成员

SMEMBERS key
# 返回集合中的所有成员

SISMEMBER key member
# 判断某个成员是否是集合的成员，返回 1 表示存在，0 表示不存在
```

```bash [集合运算]
SCARD key
# 获取集合的成员数量

SDIFF key1 [key2 ...]
# 返回第一个集合与其他集合之间的差集

SDIFFSTORE destination key1 [key2 ...]
# 计算差集并将结果存入 destination 集合中

SINTER key1 [key2 ...]
# 返回所有给定集合的交集

SINTERSTORE destination key1 [key2 ...]
# 计算交集并将结果存储到 destination 集合中

SUNION key1 [key2 ...]
# 返回所有给定集合的并集

SUNIONSTORE destination key1 [key2 ...]
# 计算并集并将结果存储到 destination 集合中
```

```bash [随机与移动]
SPOP key
# 随机移除并返回集合中的一个元素

SRANDMEMBER key [count]
# 随机返回集合中的一个或多个元素（不移除）

SMOVE source destination member
# 将指定成员从 source 集合移动到 destination 集合
```

```bash [其他]
SSCAN key cursor [MATCH pattern] [COUNT count]
# 迭代集合中的元素
```

:::

## 4. 💻 基础示例

```bash
# 添加元素到集合
SADD myset "hello"
# (integer) 1

SADD myset "redis" "world" "hello"
# (integer) 2
# 表示成功添加了 2 个元素
# 已存在元素不会重复添加

# 查看集合所有成员
SMEMBERS myset
# 1) "hello"
# 2) "redis"
# 3) "world"

# 判断元素是否存在
SISMEMBER myset "redis"
# (integer) 1

# 移除集合中的元素
SREM myset "world"
# (integer) 1

# 查看当前集合成员
SMEMBERS myset
# 1) "hello"
# 2) "redis"

# 获取集合成员数量
SCARD myset
# (integer) 2

# 随机弹出一个元素
SPOP myset
# "redis"

# 查看剩余元素
SMEMBERS myset
# 1) "hello"

# 添加另一个集合
SADD set1 "a" "b" "c"
SADD set2 "b" "c" "d"

# 获取两个集合的差集
SDIFF set1 set2
# 1) "a"

# 存储差集到新集合
SDIFFSTORE set_diff set1 set2
# (integer) 1

# 获取交集
SINTER set1 set2
# 1) "b"
# 2) "c"

# 获取并集
SUNION set1 set2
# 1) "a"
# 2) "b"
# 3) "c"
# 4) "d"

# 随机获取一个元素但不删除
SRANDMEMBER myset
# "hello"

# 使用 SSCAN 迭代集合元素
SSCAN myset 0 MATCH * COUNT 10
# 1) "0"
# 2) 1) "hello"
```
