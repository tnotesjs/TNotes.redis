# [0021. Redis Stream](https://github.com/Tdahuyou/TNotes.redis/tree/main/notes/0021.%20Redis%20Stream)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 Redis Stream](#2--redis-stream)
- [3. 📒 消息队列相关命令](#3--消息队列相关命令)
- [4. 💻 XADD](#4--xadd)
- [5. 💻 XTRIM](#5--xtrim)
- [6. 💻 XDEL](#6--xdel)
- [7. 💻 清空 Redis Stream 中的某个流](#7--清空-redis-stream-中的某个流)
- [8. 💻 XLEN](#8--xlen)
- [9. 💻 XRANGE](#9--xrange)
- [10. 💻 XREAD](#10--xread)
- [11. 🆚 `XREAD` 与 `XRANGE` 的区别](#11--xread-与-xrange-的区别)
- [12. 📒 消费者组相关命令](#12--消费者组相关命令)

<!-- endregion:toc -->

## 1. 📝 概述

<!--
菜鸟教程 Redis stream
https://www.runoob.com/redis/redis-stream.html
📒 消费者组相关命令
部分缺失相关“示例”笔记
 -->

- 了解 Redis Stream 数据结构 —— 消息链表。
- 了解消息队列（MQ，Message Queue）的两种实现方式（“Redis Stream”、“发布订阅”）之间的区别。
- 了解消费队列相关命令的基本作用。

## 2. 📒 Redis Stream

- Redis Stream
  - Redis Stream 是 Redis 5.0 版本新增加的数据结构。
  - Redis Stream 主要用于消息队列（MQ，Message Queue）。
- 消息队列（MQ，Message Queue）
  - Redis 本身是有一个 Redis 发布订阅 (pub/sub) 来实现消息队列的功能，但它有个缺点就是 **消息无法持久化**，如果出现网络断开、Redis 宕机等，消息就会被丢弃。简单来说就是 **发布订阅 (pub/sub) 可以分发消息，但无法记录历史消息**。
  - Redis Stream 提供了消息的持久化和主备复制功能，可以让任何客户端访问任何时刻的数据，并且能记住每一个客户端的访问位置，还能保证消息不丢失。
- 消息链表
  - Redis Stream 是一个持久化的消息队列实现，其底层结构为 **消息链表**。
  - 每个 Stream 都有唯一的名称，它就是 Redis 的 key，在我们首次使用 xadd 指令追加消息时自动创建。
  - 每个消息具有唯一的 ID（`messageID`），并且按照插入顺序串接起来。
  - 消息一旦被添加到 Stream 中，就会按顺序持久化在 Redis 中，支持主从复制，确保数据不会丢失。
  - 消费者组（`Consumer Group`）和相关机制（如 `XREADGROUP`、`XACK` 等命令）进一步增强了 Stream 在消息处理中的可靠性与并发控制能力。
  - ![](./assets/1.svg)
  - `Consumer Group`
    - `Consumer Group` 表示消费组
    - 使用 `XGROUP CREATE` 命令创建
    - 一个消费组有多个消费者 `Consumer`
  - `last_delivered_id`
    - `last_delivered_id` 表示游标
    - 每个消费组会有个游标 `last_delivered_id`
    - 任意一个消费者读取了消息都会使游标 `last_delivered_id` 往前移动
  - `pending_ids`
    - `pending_ids` 表示消费者 `Consumer` 的状态变量，记录了当前消费者已经读取但还未通过 `XACK` 命令确认处理完成的消息 ID。
    - `pending_ids` 确保在消费者处理消息失败或超时时，这些消息可以被重新分配给其他消费者处理，从而实现可靠的消息传递机制。
    - `pending_ids` 是 Redis Stream 实现高可靠性消息消费的重要机制之一。
  - **pending_ids 工作流程**
    - 当消费者使用 `XREADGROUP` 命令从 Stream 中读取消息时，Redis 会自动将这些消息的 ID 添加到该消费者的 `pending_ids` 列表中。
    - 当消费者成功处理完某条消息并发送 `XACK` 确认后，该消息的 ID 就会从 `pending_ids` 中移除。
    - 如果消费者未确认消息（如崩溃或连接中断），这些消息会保留在 `pending_ids` 中，并可通过 `XPENDING` 或 `XCLAIM` 命令进行转移或重新处理。
  - **示例场景**：
    - 假设消费者 A 从 Stream 中读取了三条消息：`1-0`, `2-0`, `3-0`，此时这三条消息的 ID 会被记录在消费者 A 的 `pending_ids` 中。
    - 如果消费者 A 处理完 `1-0` 并发送 `XACK`，则 `1-0` 会从 `pending_ids` 中移除。
    - 若消费者 A 在处理 `2-0` 和 `3-0` 时发生异常退出，则这两条消息仍保留在 `pending_ids` 中，并可被其他消费者通过 `XCLAIM` 抢占处理。

## 3. 📒 消息队列相关命令

- `XADD` 添加消息到末尾
- `XTRIM` 对流进行修剪，限制长度
- `XDEL` 删除消息
- `XLEN` 获取流包含的元素数量，即消息长度
- `XRANGE` 获取消息列表，会自动过滤已经删除的消息
- `XREVRANGE` 反向获取消息列表，ID 从大到小
- `XREAD` 以阻塞或非阻塞方式获取消息列表

## 4. 💻 XADD

- 使用 XADD 向队列添加消息，如果指定的队列不存在，则创建一个队列，XADD 语法格式：`XADD key ID field value [field value ...]`
  - `key`：流名称，如果不存在就创建。
  - `ID`：消息 id，我们使用 `*` 表示由 redis 生成，可以自定义，但是要自己保证递增性。
  - `field` `value`：记录。

```bash
XADD mystream * a 1 b 2 c 3 # 添加消息
# "1752309514565-0"

XADD mystream * field1 value1 field2 value2 field3 value3 # 添加消息
# "1752309531866-0"

XLEN mystream # 获取消息数量
# (integer) 2

XRANGE mystream - + # 获取消息
# 1) 1) "1752309514565-0"
#    2) 1) "a"
#       2) "1"
#       3) "b"
#       4) "2"
#       5) "c"
#       6) "3"
# 2) 1) "1752309531866-0"
#    2) 1) "field1"
#       2) "value1"
#       3) "field2"
#       4) "value2"
#       5) "field3"
#       6) "value3"
```

## 5. 💻 XTRIM

- 使用 XTRIM 对流进行修剪，限制长度，语法格式：`XTRIM key MAXLEN [~] count`
  - `key`：流名称
  - `MAXLEN`：长度，指定对 Stream 进行修剪时的最大消息长度，用于控制流中保留的消息数量上限，避免数据无限增长。
  - `count`：数量，表示在执行 `XTRIM` 命令时，希望保留的消息条数，Redis 会从流的旧消息开始删除，直到消息总数小于等于该数值。

```bash
# 添加多条消息到 mystream 流中
XADD mystream * name Alice
# "1752310438840-0"

XADD mystream * name Bob
# "1752310443630-0"

XADD mystream * name Charlie
# "1752310451585-0"

XADD mystream * name David
# "1752310457530-0"

XLEN mystream
# (integer) 4

# 设置流的最大长度为 2，保留最新的两条消息，其余删除
XTRIM mystream MAXLEN 2
# (integer) 2

XLEN mystream
# (integer) 2

# 查看当前流中的消息
XRANGE mystream - +
# 1) 1) "1752310451585-0"
#    2) 1) "name"
#       2) "Charlie"
# 2) 1) "1752310457530-0"
#    2) 1) "name"
#       2) "David"
```

## 6. 💻 XDEL

- 使用 `XDEL` 删除消息，语法格式：`XDEL key ID [ID ...]`。
  - `key`：流名称
  - `ID`：消息的 ID

```bash
XADD mystream * a 1
# "1752329901909-0"

XADD mystream * b 2
# "1752329905517-0"

XADD mystream * c 3
# "1752329911543-0"

XDEL mystream "1752329905517-0" # 删除消息 -> b
# (integer) 1

XRANGE mystream - +
# 1) 1) "1752329901909-0"
#    2) 1) "a"
#       2) "1"
# 2) 1) "1752329911543-0"
#    2) 1) "c"
#       2) "3"
```

## 7. 💻 清空 Redis Stream 中的某个流

- 要 **清空 Redis Stream 中的某个流（如 `mystream`）中的所有消息**，有以下几种方式：
- 方法一：使用 `XDEL` + `XRANGE` 删除所有消息（适用于小数据量）
- 方法二：使用 `XTRIM` 设置最大长度为 0（推荐）
- 方法三：使用 `DEL` 直接删除整个 key（彻底清空）

| 方法              | 是否清空消息 | 是否保留 Stream 元数据 | 是否适用生产环境 |
| ----------------- | ------------ | ---------------------- | ---------------- |
| `XDEL` + `XRANGE` | ✅           | ✅                     | ❌（效率低）     |
| `XTRIM ... 0`     | ✅           | ✅（保留消费者组等）   | ✅               |
| `DEL key`         | ✅           | ❌（全部清除）         | ✅（需谨慎）     |

::: code-group

```bash [1]
# 获取 mystream 中的所有消息 ID
XRANGE mystream - +

# 假设输出如下：
# 1) 1) "1752309514565-0"
#    ...
# 2) 1) "1752309514566-0"
#    ...

# 然后逐个删除消息
XDEL mystream 1752309514565-0 1752309514566-0
# 注意：这种方式适合消息数量少的情况，不适用于大量数据。
```

```bash [2]
# 虽然 `XTRIM` 的语义是限制最大长度，但你可以通过设置保留 0 条消息来达到“清空”的效果。
XTRIM mystream MAXLEN 0
# 执行后，该 Stream 中将不再有任何消息。
# 优点：高效、简洁，适用于生产环境。
# 注意：该操作不可逆，请确保你真的想清空数据。
```

```bash [3]
# 如果你不仅想清空消息，还想彻底删除这个 Stream 及其所有元数据（包括消费者组等）。
DEL mystream
# 这会完全删除 `mystream` 这个 key，包括它关联的消费者组、pending 消息等信息。
# 如果你还想继续使用这个 Stream，Redis 会在下次 `XADD` 时重新创建它。
```

:::

## 8. 💻 XLEN

- 使用 `XLEN` 获取流包含的元素数量，即消息长度，语法格式：`XLEN key`
  - `key`：流名称

```bash
XADD mystream * item 1
# "1752330055220-0"

XADD mystream * item 2
# "1752330059206-0"

XLEN mystream
# (integer) 2

XADD mystream * item 3
# "1752330068705-0"

XLEN mystream
# (integer) 3

XDEL mystream "1752330059206-0"
# (integer) 1

XLEN mystream
# (integer) 2
```

## 9. 💻 XRANGE

- 使用 `XRANGE` 获取消息列表，会自动过滤已经删除的消息，语法格式：`XRANGE key start end [COUNT count]`
  - `key`：流名称
  - `start`：指定查询范围的起始消息 ID，支持使用 - 表示流中的第一条消息。
  - `end`：指定查询范围的结束消息 ID，支持使用 + 表示流中的最后一条消息。
  - `count`：可选参数，限制返回的消息数量，用于控制每次查询返回的最大条数，提升性能或分页获取数据。

```bash
# 添加几条消息到 mystream 流中
XADD mystream * name Alice
# "1752330452016-0"

XADD mystream * name Bob
# "1752330455579-0"

XADD mystream * name Charlie
# "1752330459416-0"

XADD mystream * name David
# "1752330462767-0"

# 查看流中的所有消息
XRANGE mystream - +
# 1) 1) "1752330452016-0"
#    2) 1) "name"
#       2) "Alice"
# 2) 1) "1752330455579-0"
#    2) 1) "name"
#       2) "Bob"
# 3) 1) "1752330459416-0"
#    2) 1) "name"
#       2) "Charlie"
# 4) 1) "1752330462767-0"
#    2) 1) "name"
#       2) "David"

# 只查看前两条消息
XRANGE mystream - + COUNT 2
# 1) 1) "1752330452016-0"
#    2) 1) "name"
#       2) "Alice"
# 2) 1) "1752330455579-0"
#    2) 1) "name"
#       2) "Bob"

# 查看从 Bob 开始的消息（指定 start ID）
XRANGE mystream "1752330455579-0" +
# 1) 1) "1752330455579-0"
#    2) 1) "name"
#       2) "Bob"
# 2) 1) "1752330459416-0"
#    2) 1) "name"
#       2) "Charlie"
# 3) 1) "1752330462767-0"
#    2) 1) "name"
#       2) "David"
```

## 10. 💻 XREAD

- 使用 `XREAD` 以阻塞或非阻塞方式获取消息列表，语法格式：`XREAD [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] id [id ...]`
  - `count`：可选参数，限制每次返回的消息数量。
  - `milliseconds`：可选参数，设置阻塞等待新消息的毫秒数（`0` 表示非阻塞，`>0` 表示阻塞等待）。
  - `key`：要读取的流名称（可指定多个流）。
  - `id`：指定从哪个消息 ID 开始读取（使用 `$` 表示只接收新消息）。
- 注意：`STREAMS` 关键字后跟要读取的 key 列表，然后是 id 列表，两个列表数量必须一致。
- 示例：
  - 示例 1：非阻塞读取（获取已有消息）
  - 示例 2：阻塞读取（等待新消息）
  - 示例 3：多流读取

::: code-group

```bash [1]
# 添加消息到流
XADD mystream * event "Login" user "Alice"
# "1752331675284-0"

XADD mystream * event "Purchase" user "Bob"
# "1752331679443-0"

# 读取 mystream 中所有消息（从 ID 0 开始）
XREAD STREAMS mystream 0
# 1) 1) "mystream"
#    2) 1) 1) "1752331675284-0"
#          2) 1) "event"
#             2) "Login"
#             3) "user"
#             4) "Alice"
#       2) 1) "1752331679443-0"
#          2) 1) "event"
#             2) "Purchase"
#             3) "user"
#             4) "Bob"
```

```bash [2]
# 在另一个终端添加新消息：
# XADD mystream * event "Logout" user "Charlie"

# 阻塞等待 mystream 的新消息（最多等待 60000 毫秒）
XREAD BLOCK 60000 STREAMS mystream $
# 1) 1) "mystream"
#    2) 1) 1) "1752331864003-0"
#          2) 1) "event"
#             2) "Logout"
#             3) "user"
#             4) "Charlie"
# (10.53s) # 这是等待的时间
```

```bash [3]
# 创建第二个流
XADD notifications * type "Alert" content "Server Down"
# "1752331020000-0"

# 同时读取两个流的最新消息
XREAD STREAMS mystream notifications $ $
# 1) 1) "mystream"
#    2) (empty array)  # 没有新消息
# 2) 1) "notifications"
#    2) 1) 1) "1752331020000-0"
#          2) 1) "type"
#             2) "Alert"
#             3) "content"
#             4) "Server Down"
```

:::

- **阻塞模式**：
  - 使用 `BLOCK` 参数可使客户端挂起等待新消息。
  - 特别适合实时消息推送场景（如聊天系统、实时监控）。
  - 超时后返回 `(nil)`。
- **多流监听**：
  - 可同时监听多个流，返回结果按输入 key 的顺序排列。
  - 每个流独立返回其新消息。
- **ID 特殊值**：
  - `0`：从第一条消息开始读取。
  - `$`：只读取调用命令后到达的新消息。
  - `<id>`：从指定 ID 之后的消息开始读取。

## 11. 🆚 `XREAD` 与 `XRANGE` 的区别

| 特性     | `XRANGE`           | `XREAD`                 |
| -------- | ------------------ | ----------------------- |
| 读取方式 | 历史消息查询       | 实时消息获取            |
| 阻塞支持 | ❌                 | ✅（通过 `BLOCK` 参数） |
| 多流支持 | ❌（单流操作）     | ✅（可同时监听多个流）  |
| 典型场景 | 数据审计、批量处理 | 实时通知、事件驱动架构  |

## 12. 📒 消费者组相关命令

- `XGROUP CREATE` 创建消费者组
- `XREADGROUP GROUP` 读取消费者组中的消息
- `XACK` 将消息标记为"已处理"
- `XGROUP SETID` 为消费者组设置新的最后递送消息 ID
- `XGROUP DELCONSUMER` 删除消费者
- `XGROUP DESTROY` 删除消费者组
- `XPENDING` 显示待处理消息的相关信息
  - 查看某个消费者组中所有消费者或指定消费者的待确认消息信息。
- `XCLAIM` 转移消息的归属权
  - 将属于某个消费者的未确认消息转移到另一个消费者名下，通常用于故障转移或负载均衡。
- `XINFO` 查看流和消费者组的相关信息
- `XINFO GROUPS` 打印消费者组的信息
- `XINFO STREAM` 打印流信息
