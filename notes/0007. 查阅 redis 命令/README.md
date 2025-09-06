# [0007. 查阅 redis 命令](https://github.com/Tdahuyou/TNotes.redis/tree/main/notes/0007.%20%E6%9F%A5%E9%98%85%20redis%20%E5%91%BD%E4%BB%A4)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 🔍 `SET` Command](#2--set-command)
- [3. 🤔 官方文档中的 “ACL categories” 是什么？](#3--官方文档中的-acl-categories-是什么)
- [4. 🔗 References](#4--references)

<!-- endregion:toc -->

## 1. 📝 概述

- 以 `SET` 命令为例，简单介绍一下官方 redis commands 文档的基本结构。

## 2. 🔍 `SET` Command

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-03-17-49-26.png)

- 以 SET 命令的查询结果为例，通过文档，我们可以了解到有关 SET 命令的以下信息：
- Syntax 该命令的语法
- Available since 该命令要求的最低 Redis 版本
- Time complexity 该命令的时间复杂度
- ACL categories 该命令的 ACL 分类
- Options 该命令的参数选项
- Examples 该命令的示例用法
  - 注：官方提供的 demo 组件是可键入命令实现交互的
  - ![图 1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-03-18-01-17.png)
  - ![图 2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-03-18-01-51.png)
- Patterns 关于该命令的常见使用模式的指导，例如实现锁机制、计数器、限流等典型场景。
  - 在不同的业务或技术场景下，某个 Redis 命令应该如何使用，以及常见的最佳实践。
  - 它帮助开发者理解命令的实际用途，并提供典型用例的指导。
- Return information 该命令的返回值说明
- Code examples 一些主流语言的示例代码
  - ![图 3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-03-18-02-25.png)
- History 有关该命令的一些历史信息

## 3. 🤔 官方文档中的 “ACL categories” 是什么？

- `ACL categories: @write, @string, @slow`
  - ACL 是 Access Control List（访问控制列表）的缩写
  - `@write`、`@string` 和 `@slow` 是 **命令分类（Command Categories）** 的标签，用于将不同的 Redis 命令按其功能或行为进行归类。通过这些分类，可以更方便地为用户授予或限制某类命令的执行权限。
  - `@write`：表示该命令会对 Redis 中的数据进行写操作。
    - 示例命令：`SET`, `DEL`, `HSET` 等。
    - 授予此分类权限后，用户可以执行所有标记为写操作的命令。
  - `@string`：表示该命令与字符串类型的数据操作相关。
    - 示例命令：`GET`, `SET`, `STRLEN`, `APPEND` 等。
    - 授予此分类权限后，用户可以执行所有字符串相关的命令。
  - `@slow`：表示该命令可能执行时间较长，通常涉及大量数据处理或复杂计算。
    - 示例命令：`KEYS *`, `SORT`, `SCAN`（大数据集时）等。
    - 授予此分类权限后，用户可以执行这些潜在“慢”命令。
- **🤔 在 ACL 中如何使用这些分类？**
- 你可以使用 `ACL SETUSER` 命令来为用户添加或移除特定分类权限。例如：

```bash
# 给用户 john 添加 @write 和 @string 权限
ACL SETUSER john +@write +@string

# 移除用户 john 的 @slow 权限
ACL SETUSER john -@slow
```

- 这样你就可以灵活控制用户的命令访问权限，以增强 Redis 实例的安全性和稳定性。

## 4. 🔗 References

- https://redis.io/docs/latest/commands/
  - 查阅 redis 最新的命令
  - ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-03-22-19-02.png)
- https://redis.io/docs/latest/commands/set/
  - set command
- https://redis.io/docs/latest/commands/acl/
  - acl command
