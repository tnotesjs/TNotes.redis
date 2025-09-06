# [0024. try redis](https://github.com/tnotesjs/TNotes.redis/tree/main/notes/0024.%20try%20redis)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 💻 创建并使用在线的 redis 数据库](#2--创建并使用在线的-redis-数据库)
  - [2.1. 多种连接方式](#21-多种连接方式)
    - [2.1.1. Redis Insight](#211-redis-insight)
    - [2.1.2. Redis CLI](#212-redis-cli)
    - [2.1.3. Redis Client](#213-redis-client)
  - [2.2. 使用 CLI 来连接 redis 数据库](#22-使用-cli-来连接-redis-数据库)
  - [2.3. 使用 VSCode redis 插件来连接 redis 数据库](#23-使用-vscode-redis-插件来连接-redis-数据库)
- [3. 🔍 可视化工具会自动识别“命名空间”](#3--可视化工具会自动识别命名空间)

<!-- endregion:toc -->

## 1. 📝 概述

- 了解官方的 try redis 服务。
- 学会使用其它第三方可视化工具连接 redis 数据库，可视化地预览和编辑 key-val。

## 2. 💻 创建并使用在线的 redis 数据库

- 你可以在 redis 官网中通过 `try redis` 获取到一个在线免费的在线 redis 数据库，方便你用来学习和快速测试相关 redis 命令。
- 支持 google 和 Github 账号登录。
- 免费版有 30M 的空间可供使用，用来入门 redis 应该够用了。

::: swiper

![1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-57-29.png)

![2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-58-02.png)

![3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-58-38.png)

:::

### 2.1. 多种连接方式

1. Redis Insight：在线的可视化编辑器。
2. Redis CLI：通过命令行工具来连接。
3. Redis Client：通过多种主流的客户端连接。
4. 利用其它客户端工具来连接。

#### 2.1.1. Redis Insight

- ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-11-02-57.png)
- ![图 4](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-55-25.png)

#### 2.1.2. Redis CLI

- ![图 3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-11-06-22.png)

#### 2.1.3. Redis Client

- ![图 1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-11-04-49.png)
- ![图 2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-11-05-00.png)

### 2.2. 使用 CLI 来连接 redis 数据库

- 以 CLI 的方式为例，你可以在 Windows 上进入 wsl 然后运行复制过来的 CLI 命令完成连接。
- ![图 4](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-11-09-24.png)

### 2.3. 使用 VSCode redis 插件来连接 redis 数据库

- 你也可以利用其它你熟悉的数据库工具来连接这个在线的 redis 数据库，比如 VSCode 中的一些数据库插件。

::: swiper

![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-52-59.png)

![图 1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-53-21.png)

:::

## 3. 🔍 可视化工具会自动识别“命名空间”

- 无论是官方的 Redis Insight 还是其它第三方可视化工具，大都支持“命名空间”的识别。
- Redis Insight
  - ![图 3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-54-41.png)
- 以 `database-client.com` 推出的 `Redis` VSCode 插件为例，它也会自动识别 KEY 中的冒号，对键进行分组，以实现更好地 UI 交互。
  - ![图 2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-07-04-10-53-31.png)
