# [0014. Redis HyperLogLog](https://github.com/tnotesjs/TNotes.redis/tree/main/notes/0014.%20Redis%20HyperLogLog)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 HyperLogLog](#2--hyperloglog)
- [3. 🤔 什么是基数？](#3--什么是基数)
- [4. 📒 常用的 redis HyperLogLog 命令](#4--常用的-redis-hyperloglog-命令)
- [5. 💻 基础示例](#5--基础示例)
- [6. 🤔 `PFADD`、`PFCOUNT`、`PFMERGE`…… 这些命令中的 `PF` 是什么？](#6--pfaddpfcountpfmerge-这些命令中的-pf-是什么)

<!-- endregion:toc -->

## 1. 📝 概述

- 介绍了 Redis 中的 HyperLogLog 是什么，以及基本使用，包括其适用场景、特点和相关命令。

## 2. 📒 HyperLogLog

- Redis 在 2.8.9 版本添加了 HyperLogLog 结构。
- Redis HyperLogLog 是用来做 **基数统计** 的算法，其优点在于：即使输入元素数量极大，计算所需的空间始终是固定且很小的。
- 在 Redis 里面，每个 HyperLogLog 键只需要花费 **12 KB 内存**，就可以计算接近 $2^{64}$ 个不同元素的基数。这和计算基数时，元素越多耗费内存就越多的集合形成鲜明对比。
- 但是，因为 HyperLogLog 只会根据输入元素来计算基数，而 **不存储输入元素本身**，所以 HyperLogLog 不能像集合那样，返回输入的各个元素。
- Redis HyperLogLog 适用于大规模数据场景下的 UV（独立访客）统计、去重计数等需求。

## 3. 🤔 什么是基数？

- 基数是指一个数据集中**不重复的元素个数**。例如数据集 `{1, 3, 5, 7, 5, 7, 8}` 的基数为 `5`（即 `{1, 3, 5, 7, 8}`）。
- HyperLogLog 能在误差可接受范围内快速估算基数。

## 4. 📒 常用的 redis HyperLogLog 命令

::: code-group

```bash [添加操作]
PFADD key element [element ...]
# 添加指定元素到 HyperLogLog 中
```

```bash [统计操作]
PFCOUNT key [key ...]
# 返回给定 HyperLogLog 的基数估算值
```

```bash [合并操作]
PFMERGE destkey sourcekey [sourcekey ...]
# 将多个 HyperLogLog 合并为一个新的 HyperLogLog
```

:::

## 5. 💻 基础示例

```bash
# 添加元素到 HyperLogLog
PFADD hll a b c d e f g
# (integer) 1 表示可能添加了新数据

# 添加更多元素（含重复）
PFADD hll a a a b b c
# (integer) 0 表示没有新的唯一元素被添加

# 获取基数估计值
PFCOUNT hll
# (integer) 7 （估计有 7 个不同的元素）

# 创建另一个 HyperLogLog 并添加数据
PFADD hll2 x y z a b
# (integer) 1

# 合并两个 HyperLogLog 到 hll3
PFMERGE hll3 hll hll2
# OK

# 查看合并后的基数估计值
PFCOUNT hll3
# (integer) 10 （估计有 10 个不同的元素）
```

## 6. 🤔 `PFADD`、`PFCOUNT`、`PFMERGE`…… 这些命令中的 `PF` 是什么？

- `PF` 指的是 Philippe Flajolet，他是提出 HyperLogLog 算法的计算机科学家之一。Redis 使用这一命名方式来纪念他的贡献。
- Redis 的创始人 Salvatore Sanfilippo（又称 antirez）为了致敬这些研究者，在实现 HyperLogLog 相关命令时使用了他们的名字缩写。`PFADD`、`PFCOUNT` 和 `PFMERGE` 中的 `PF` 即来源于此。
