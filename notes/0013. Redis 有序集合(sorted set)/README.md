# [0013. Redis 有序集合(sorted set)](https://github.com/Tdahuyou/TNotes.redis/tree/main/notes/0013.%20Redis%20%E6%9C%89%E5%BA%8F%E9%9B%86%E5%90%88(sorted%20set))

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 常用的 redis zset 命令](#2--常用的-redis-zset-命令)
- [3. 💻 基础示例](#3--基础示例)

<!-- endregion:toc -->

## 1. 📝 概述

- Redis 有序集合和集合一样也是 string 类型元素的集合,且不允许重复的成员。
- 不同的是每个元素都会关联一个 double 类型的分数。redis 正是通过分数来为集合中的成员进行从小到大的排序。
- 有序集合的成员是唯一的,但分数(score)却可以重复。
- 集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。集合中最大的成员数为 $2^{32} - 1$（40 多亿个成员）。

## 2. 📒 常用的 redis zset 命令

::: code-group

```bash [添加与更新]
ZADD key score1 member1 [score2 member2 ...]
# 向有序集合添加一个或多个成员，或者更新已存在成员的分数
```

```bash [获取信息]
ZCARD key
# 获取有序集合的成员数量

ZCOUNT key min max
# 计算在有序集合中指定区间分数的成员数量

ZRANGE key start stop [WITHSCORES]
# 通过索引区间返回有序集合指定区间内的成员及其分数（按分数升序）

ZREVRANGE key start stop [WITHSCORES]
# 返回有序集合中指定区间内的成员，按分数从高到低排序

ZRANK key member
# 返回有序集合中指定成员的索引（按分数从小到大）

ZREVRANK key member
# 返回有序集合中指定成员的排名（按分数从大到小）

ZSCORE key member
# 返回有序集中指定成员的分数值
```

```bash [范围删除]
ZREM key member [member ...]
# 移除有序集合中的一个或多个成员

ZREMRANGEBYRANK key start stop
# 移除有序集合中给定排名区间的所有成员

ZREMRANGEBYSCORE key min max
# 移除有序集合中给定分数区间的所有成员
```

```bash [范围查询]
ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]
# 返回有序集合中分数介于 min 和 max 之间的成员列表

ZREVRANGEBYSCORE key max min [WITHSCORES]
# 按分数从高到低返回有序集合中介于 max 和 min 的成员列表

ZRANGEBYLEX key min max [LIMIT offset count]
# 根据字典顺序返回有序集合中的成员（前提是所有成员分数相同）
```

```bash [聚合操作]
ZUNIONSTORE destination numkeys key [key ...]
# 计算一个或多个有序集合的并集，并将结果存储在 destination 中

ZINTERSTORE destination numkeys key [key ...]
# 计算多个有序集合的交集，并将结果存储在 destination 中
```

```bash [其他]
ZINCRBY key increment member
# 对有序集合中指定成员的分数加上增量 increment

ZLEXCOUNT key min max
# 在有序集合中计算指定字典区间内的成员数量（要求所有成员分数相同）

ZSCAN key cursor [MATCH pattern] [COUNT count]
# 迭代有序集合中的元素（包括成员和对应的分数）
```

:::

## 3. 💻 基础示例

```bash
# 添加成员到有序集合
ZADD myzset 1 "one"
# (integer) 1

ZADD myzset 2 "two" 3 "three" 1 "one"
# (integer) 2 (one 已存在，仅更新分数)

# 查看有序集合成员（按分数从小到大）
ZRANGE myzset 0 -1 WITHSCORES
# 1) "one"
# 2) "1"
# 3) "two"
# 4) "2"
# 5) "three"
# 6) "3"

# 查看成员的分数
ZSCORE myzset "two"
# "2"

# 查看成员的排名（索引）
ZRANK myzset "three"
# (integer) 2

# 按分数区间查询成员
ZRANGEBYSCORE myzset 1 2 WITHSCORES
# 1) "one"
# 2) "1"
# 3) "two"
# 4) "2"

# 更新成员分数
ZINCRBY myzset 2 "one"
# "3"

# 再次查看成员及分数
ZRANGE myzset 0 -1 WITHSCORES
# 1) "two"
# 2) "2"
# 3) "three"
# 4) "3"
# 5) "one"
# 6) "3"

# 删除成员
ZREM myzset "two"
# (integer) 1

# 查看剩余成员
ZRANGE myzset 0 -1 WITHSCORES
# 1) "three"
# 2) "3"
# 3) "one"
# 4) "3"

# 删除指定排名范围的成员（例如删除第 0 到第 0 位）
ZREMRANGEBYRANK myzset 0 0
# (integer) 1

# 查看剩余成员
ZRANGE myzset 0 -1 WITHSCORES
# 1) "one"
# 2) "3"

# 添加更多成员用于交集/并集演示
ZADD set1 1 "a" 2 "b" 3 "c"
ZADD set2 2 "b" 3 "c" 4 "d"

# 计算并集并保存到 dest_union
ZUNIONSTORE dest_union 2 set1 set2
# (integer) 4

# 查看并集结果
ZRANGE dest_union 0 -1 WITHSCORES
# 1) "a"
# 2) "1"
# 2) "b"
# 3) "4"
# 3) "c"
# 4) "6"
# 4) "d"
# 5) "4"

# 计算交集并保存到 dest_inter
ZINTERSTORE dest_inter 2 set1 set2
# (integer) 2

# 查看交集结果
ZRANGE dest_inter 0 -1 WITHSCORES
# 1) "b"
# 2) "4"
# 2) "c"
# 3) "6"

# 使用 ZSCAN 迭代有序集合
ZSCAN myzset 0 MATCH * COUNT 10
# 1) "0"
# 2) 1) "one"
#    2) "3"
```
