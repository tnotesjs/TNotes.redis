# [0023. KEY 冒号分割命名法](https://github.com/tnotesjs/TNotes.redis/tree/main/notes/0023.%20KEY%20%E5%86%92%E5%8F%B7%E5%88%86%E5%89%B2%E5%91%BD%E5%90%8D%E6%B3%95)

<!-- region:toc -->

- [1. 概述](#1-概述)
- [2. KEY 冒号分割命名法是什么？](#2-key-冒号分割命名法是什么)
- [3. KEY 冒号分割命名法有什么用？](#3-key-冒号分割命名法有什么用)
  - [3.1. 更好的 UI 交互](#31-更好的-ui-交互)
  - [3.2. 避免键名冲突](#32-避免键名冲突)
  - [3.3. 便于查找与维护](#33-便于查找与维护)
  - [3.4. 支持命名空间模拟](#34-支持命名空间模拟)
  - [3.5. 适用于集群和缓存场景](#35-适用于集群和缓存场景)

<!-- endregion:toc -->

## 1. 概述

- 了解 KEY 的命名规范及其好处。
- 基本语法：`<实体类型>:<实体类型>:<实体ID>`

## 2. KEY 冒号分割命名法是什么？

```bash
# 以 👇 下面这个示例作为参考
HSET user:1000 name "Alice" age "25" email "alice@example.com"
```

- `user:1000` 是 Redis 中一种 **命名约定（key naming convention）**，用于更好地组织和管理键（key），具有以下目的和优势：
- `user:1000` **表示数据类型 + ID**
  - `user`: 表示这个 key 存储的是“用户”对象。
  - `1000`: 表示该用户的唯一标识 ID。
  - 含义清晰：这是 ID 为 `1000` 的用户信息。

```bash
HSET user:1001 name "Alice" age "25" email "alice@example.com"
# (integer) 3
mset part1:0001 1 part1:0001:1 1 part1:0001:2 2 part2:0001 2
# OK
keys part1:*
# 1) "part1:0001:1"
# 2) "part1:0001"
# 3) "part1:0001:2"
```

## 3. KEY 冒号分割命名法有什么用？

| 作用 | 描述 |
| --- | --- |
| 更好地 UI 交互 | 可视化的数据库客户端工具大都会解析 `:` 分号，形成树形结构，以便预览和编辑数据。 |
| 易读性 | `user:1000` 清晰表达是用户 ID 为 1000 的数据 |
| 避免冲突 | 不同实体使用不同前缀，如 `user:1000` vs `product:1000` |
| 可维护性 | 便于使用通配符批量操作 |
| 模拟命名空间 | 使用 `:` 分隔符实现逻辑分组 |
| 支持扩展 | 如 `user:1000:name`、`user:1000:email` 等 |

### 3.1. 更好的 UI 交互

- 你可以在 redis 官网中通过 `try redis` 获取到一个在线免费的在线 redis 数据库，然后通过 Redis Insight 工具来在线预览数据库中的相关数据。

::: swiper

![1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-57-29.png)

![2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-58-02.png)

![3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-58-38.png)

![4](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-55-25.png)

![5](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-54-41.png)

:::

- 你可以随便在 VSCode 中下载一个 redis 插件，然后连接到你的 redis 数据库，通过可视化面板来预览数据。UI 视图会自动根据冒号分割对数据进行分组。

::: swiper

![1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-52-59.png)

![2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-53-21.png)

![3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-53-31.png)

:::

### 3.2. 避免键名冲突

- Redis 是全局命名空间的数据库，使用前缀可以防止不同业务或实体之间的 key 冲突。

例如：

```bash
user:1000
order:1000
```

虽然都有 `1000`，但它们属于不同的业务实体，不会冲突。

### 3.3. 便于查找与维护

- 使用统一格式命名 key，可以更容易地通过命令如 `KEYS user:*` 或 `SCAN 0 user:*` 来查找、调试、清理特定类型的 key。

```bash
keys part1:*
# 1) "part1:0001:1"
# 2) "part1:0001"
# 3) "part1:0001:2"

keys user:*
# 1) "user:1001"
# 2) "user:1000"
```

### 3.4. 支持命名空间模拟

- Redis 没有原生的命名空间机制，但通过冒号 `:` 分隔符，可以模拟出类似命名空间的结构。
- 常见写法：

```bash
user:1000:profile
user:1000:settings
```

这表示对同一个用户的不同模块数据进行细分。

### 3.5. 适用于集群和缓存场景

- 在分布式系统中，良好的 key 命名有助于快速定位问题、做缓存清理、迁移等操作。
