# [0019. Redis 服务器](https://github.com/Tdahuyou/TNotes.redis/tree/main/notes/0019.%20Redis%20%E6%9C%8D%E5%8A%A1%E5%99%A8)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 Redis 服务常用命令](#2--redis-服务常用命令)
- [3. 💻 INFO](#3--info)
- [4. 💻 CLIENT](#4--client)

<!-- endregion:toc -->

## 1. 📝 概述

- 了解 Redis 服务命令的基本使用。

## 2. 📒 Redis 服务常用命令

- Redis 服务器命令主要是用于管理 redis 服务。
- 【1】基础管理
- 【2】持久化管理
- 【3】客户端管理
- 【4】配置管理
- 【5】信息与统计
- 【6】集群与复制
- 【7】调试与错误
- 【8】复制相关内部命令

::: code-group

```bash [1]
# 获取服务器时间
TIME

# 同步保存数据到硬盘
SAVE

# 异步保存数据到硬盘并关闭服务器
SHUTDOWN [NOSAVE] [SAVE]

# 删除当前数据库的所有 key
FLUSHDB

# 删除所有数据库的所有 key
FLUSHALL

# 获取当前数据库的 key 数量
DBSIZE

# 获取最近一次成功保存到磁盘的时间（UNIX 时间戳）
LASTSAVE

# 实时打印接收到的命令，用于调试
MONITOR
```

```bash [2]
# 在后台异步保存当前数据库的数据到磁盘
BGSAVE

# 异步执行 AOF 文件重写操作
BGREWRITEAOF
```

```bash [3]
# 获取连接到服务器的客户端列表
CLIENT LIST

# 关闭指定客户端连接
CLIENT KILL [ip:port] [ID client-id]

# 获取当前连接的名称
CLIENT GETNAME

# 设置当前连接的名称
CLIENT SETNAME connection-name

# 在指定时间内终止客户端命令执行
CLIENT PAUSE timeout
```

```bash [4]
# 获取指定配置参数的值
CONFIG GET parameter

# 修改 Redis 配置参数（无需重启）
CONFIG SET parameter value

# 改写 redis.conf 配置文件
CONFIG REWRITE

# 重置 INFO 命令中的某些统计数据
CONFIG RESETSTAT
```

```bash [5]
# 获取 Redis 服务器的各种信息和统计数值
INFO [section]

# 获取 Redis 命令详情数组
COMMAND

# 获取 Redis 命令总数
COMMAND COUNT

# 获取指定命令的键列表
COMMAND GETKEYS

# 获取指定命令的描述
COMMAND INFO command-name [command-name ...]
```

```bash [6]
# 获取集群节点映射数组
CLUSTER SLOTS

# 返回主从实例所属角色
ROLE

# 将当前服务器设为其他服务器的从属服务器
SLAVEOF host port
```

```bash [7]
# 获取 key 的调试信息
DEBUG OBJECT key

# 让 Redis 服务崩溃（调试用）
DEBUG SEGFAULT

# 管理慢查询日志
SLOWLOG subcommand [argument]
```

```bash [8]
# 复制功能的内部命令
SYNC
```

:::

## 3. 💻 INFO

```bash
127.0.0.1:6379> INFO
# Server
# ……（服务器的基本信息）

# Clients
# ……（当前客户端连接的状态统计）

# Memory
# ……（内存使用情况）

# Persistence
# ……（持久化相关信息（RDB 和 AOF））

# Threads
# ……（线程相关统计（如 I/O 多线程模式下））

# Stats
# ……（通用统计信息）

# Replication
# ……（主从复制状态）

# CPU
# ……（CPU 使用情况）

# Modules
# ……（加载的模块信息）

# Errorstats
# ……（错误计数统计）

# Cluster
# ……（集群模式下的状态）

# Keyspace
# ……（数据库键空间统计）

# Keysizes
# ……（键大小分布（需要开启 redis-cli --hotkeys 或特定配置））
```

1. Server
2. Clients
3. Memory
4. Persistence
5. Threads
6. Stats
7. Replication
8. CPU
9. Modules
10. Errorstats
11. Cluster
12. Keyspace
13. Keysizes

::: code-group

```bash [1]
127.0.0.1:6379> IFNO SERVER
# Server

redis_version:255.255.255
# 当前运行的 Redis 版本号。

redis_git_sha1:ad8c7de3
# Redis 源码仓库最后一次提交的 Git commit ID，用于标识具体的代码版本。

redis_git_dirty:0
# 表示当前源码是否修改过：0 表示未修改（clean），1 表示有未提交的改动。

redis_build_id:616717c769c6bc91
# Redis 构建时生成的唯一构建 ID，用于调试和日志追踪。

redis_mode:standalone
# Redis 运行模式：
# standalone 表示是单机模式；
# 其他值可以是 cluster（集群）或 sentinel（哨兵模式）。

os:Darwin 24.5.0 arm64
# Redis 所在操作系统信息：macOS 系统，架构为 ARM64（Apple Silicon 芯片）。

arch_bits:64
# Redis 编译时使用的架构位数：64 表示 64 位系统。

monotonic_clock:POSIX clock_gettime
# 使用的单调时钟实现方式，用于确保时间不会回拨，保障 LRU 等算法正确性。

multiplexing_api:kqueue
# Redis 使用的 I/O 多路复用机制：kqueue 是 BSD/macOS 系统下的高效事件通知机制。

atomicvar_api:c11-builtin
# 原子变量操作使用的 API：C11 标准内置原子操作支持。

gcc_version:4.2.1
# 编译 Redis 使用的 GCC 版本号。

process_id:24906
# Redis 服务器进程的 PID（Process ID），可用于系统级监控或 kill 操作。

process_supervised:no
# 是否由进程管理器（如 systemd、supervisord）托管：no 表示未被托管。

run_id:4dc26c8cd6036792984485418dad46718a00ce2b
# Redis 实例的唯一运行 ID，每次重启都会变化，用于日志、复制等场景标识实例。

tcp_port:6379
# Redis 监听的 TCP 端口号，默认为 6379。

server_time_usec:1751773480217067
# 服务器当前时间戳（微秒），可用于计算精确时间差。

uptime_in_seconds:134739
# Redis 已运行的总时间（以秒为单位），约等于 37 小时。

uptime_in_days:1
# Redis 已运行的天数，此处为 1 天左右。

hz:10
# Redis 内部定时任务执行频率（每秒执行 10 次），影响一些后台任务的精度。

configured_hz:10
# 用户配置的 HZ 值，即上面 hz 的来源配置值。

lru_clock:6943016
# LRU 算法中使用的时钟计数器，单位为分钟，用于近似判断 key 的最近使用情况。

executable:/private/tmp/redis-stable/redis/redis-server
# Redis 可执行文件的完整路径，表示是从 `/private/tmp/redis-stable/redis/` 启动的。

config_file:
# Redis 配置文件路径，为空表示启动时没有指定配置文件。

io_threads_active:0
# 是否启用 I/O 多线程：0 表示未启用，Redis 正在使用单线程处理网络 I/O。

listener0:name=tcp,bind=*,bind=-::*,port=6379
# 当前监听的网络连接信息：
# name=tcp 表示使用 TCP 协议；
# bind=* 表示监听 IPv4 的所有地址；
# bind=-::* 表示监听 IPv6 的所有地址；
# port=6379 表示服务监听端口。
```

```bash [2]
127.0.0.1:6379> INFO Clients
# Clients

connected_clients:1
# 当前已连接的客户端数量（包括普通客户端、从节点、发布订阅客户端等）。

cluster_connections:0
# 集群模式下节点之间的连接数。
# 当前未启用集群模式，所以为 0。

maxclients:10000
# Redis 允许的最大客户端连接数，由 maxclients 配置项控制。

client_recent_max_input_buffer:0
# 所有客户端中，输入缓冲区（用于存储客户端发送的命令）的最大使用量（字节）。
# 此处为 0，表示近期无大请求。

client_recent_max_output_buffer:0
# 所有客户端中，输出缓冲区（用于存储 Redis 返回给客户端的数据）的最大使用量（字节）。

blocked_clients:0
# 正在被阻塞的客户端数量，例如执行了 BLPOP 等阻塞命令的客户端。

tracking_clients:0
# 启用了 CLIENT TRACKING 功能的客户端数量（用于 Redis 的缓存模式或推送功能）。

pubsub_clients:0
# 订阅了至少一个频道的 Pub/Sub 客户端数量。

watching_clients:0
# 使用了 WATCH 命令的客户端数量，这些客户端正在进行事务操作并监视某些 key。

clients_in_timeout_table:0
# 当前被记录在超时表中的客户端数量（如设置了 client timeout 的连接）。

total_watched_keys:0
# 所有客户端总共监视的 key 数量（通过 WATCH 命令）。

total_blocking_keys:0
# 所有客户端正在等待的 key 数量（如使用了 BLPOP、BRPOP 等命令）。

total_blocking_keys_on_nokey:0
# 没有对应 key 的阻塞请求数量（比如试图弹出一个不存在的列表）。
```

```bash [3]
127.0.0.1:6379> INFO Memory
# Memory

used_memory:1348912
# Redis 分配器分配给数据的内存量（单位：字节），不包括内存碎片和元数据。

used_memory_human:1.29M
# 可读格式的 used_memory，即 1.29MB。

used_memory_rss:3112960
# Redis 进程实际从操作系统申请的物理内存大小（单位：字节），包含内存碎片。

used_memory_rss_human:2.97M
# 可读格式的 used_memory_rss，即 2.97MB。

used_memory_peak:1504000
# Redis 历史峰值内存使用量（字节）。

used_memory_peak_human:1.43M
# 可读格式的历史峰值内存使用量。

used_memory_peak_time:1751769362
# 上一次达到峰值内存的时间戳（UNIX 时间戳）。

used_memory_peak_perc:89.69%
# 当前内存使用占历史峰值的百分比。

used_memory_overhead:876552
# Redis 管理开销所使用的内存，如客户端缓冲区、主从复制缓冲区等。

used_memory_startup:801200
# Redis 启动时使用的初始内存（主要用于内部结构）。

used_memory_dataset:472360
# 数据本身占用的内存（即键值对内容）。

used_memory_dataset_perc:86.24%
# 数据内存占总使用内存的比例。

allocator_allocated:1348672
# 分配器为 Redis 数据分配的总内存。

allocator_active:3112960
# 分配器当前正在使用的内存总量。

allocator_resident:3112960
# 分配器在物理内存中驻留的内存总量。

allocator_muzzy:0
# 分配器中“muzzy”状态的内存页（通常为释放但未归还操作系统的内存）。

total_system_memory:34359738368
# 系统总内存大小（单位：字节）。

total_system_memory_human:32.00G
# 可读格式的系统总内存。

used_memory_lua:36864
# Lua 脚本引擎使用的内存。

used_memory_vm_eval:36864
# EVAL 命令使用的 Lua 内存。

used_memory_lua_human:36.00K
# 可读格式的 Lua 内存。

used_memory_scripts_eval:592
# 所有缓存脚本使用的内存。

number_of_cached_scripts:3
# 缓存中的 Lua 脚本数量。

number_of_functions:0
# 定义的函数数量。

number_of_libraries:0
# 加载的库数量。

used_memory_vm_functions:32768
# 函数对象使用的内存。

used_memory_vm_total:69632
# 所有虚拟内存对象使用的总内存。

used_memory_vm_total_human:68.00K
# 可读格式的虚拟内存总量。

used_memory_functions:216
# 函数元数据使用的内存。

used_memory_scripts:808
# 脚本元数据使用的内存。

used_memory_scripts_human:808B
# 可读格式的脚本元数据内存。

maxmemory:0
# 设置的最大可用内存（字节），0 表示无限制。

maxmemory_human:0B
# 可读格式的 maxmemory。

maxmemory_policy:noeviction
# 内存不足时采用的淘汰策略：
# noeviction 表示不再接受写请求，直到有空间为止。

allocator_frag_ratio:1.00
# 内存碎片率 = allocator_active / allocator_allocated。

allocator_frag_bytes:0
# 分配器中碎片化的内存量（字节）。

allocator_rss_ratio:1.00
# allocator_resident / allocator_active，表示活跃内存与驻留内存的关系。

allocator_rss_bytes:0
# 驻留内存减去活跃内存的差值。

rss_overhead_ratio:1.00
# used_memory_rss / (used_memory - used_memory_startup)，衡量整体内存效率。

rss_overhead_bytes:0
# RSS 超出预期部分的字节数。

mem_fragmentation_ratio:2.31
# 内存碎片率 = used_memory_rss / used_memory，数值越高说明内存碎片越多。

mem_fragmentation_bytes:1764288
# 内存碎片的总字节数。

mem_not_counted_for_evict:0
# 没有计入淘汰策略计算的内存数量。

mem_replication_backlog:0
# 主从复制环形缓冲区占用的内存。

mem_total_replication_buffers:0
# 所有客户端复制缓冲区总和。

mem_replica_full_sync_buffer:0
# 全量同步期间使用的缓冲区内存。

mem_clients_slaves:0
# 从节点客户端使用的内存。

mem_clients_normal:1888
# 普通客户端使用的内存。

mem_cluster_links:0
# 集群节点之间连接使用的内存。

mem_aof_buffer:0
# AOF 缓冲区使用的内存。

mem_allocator:libc
# 使用的内存分配器：这里是 libc 默认分配器（非 jemalloc）。

mem_overhead_db_hashtable_rehashing:0
# 在 rehash 期间哈希表额外使用的内存。

active_defrag_running:0
# 是否正在进行主动内存反碎片化：0 表示未运行。

lazyfree_pending_objects:0
# 正在被延迟释放的对象数量。

lazyfreed_objects:0
# 已经被延迟释放的对象数量。
```

```bash [4]
127.0.0.1:6379> INFO Persistence
# Persistence

loading:0
# 表示服务器是否正在加载持久化文件（RDB 或 AOF），0 表示未加载，1 表示正在加载。

async_loading:0
# 是否以异步方式加载持久化文件，0 表示未使用异步加载。

current_cow_peak:0
# 当前 fork 子进程时的写时复制（Copy-on-Write）内存峰值（字节）。

current_cow_size:0
# 当前写时复制使用的内存量（字节）。

current_cow_size_age:0
# 当前写时复制内存持续时间（秒）。

current_fork_perc:0.00
# 当前 fork 进程完成百分比（用于 RDB 持久化或 AOF 重写）。

current_save_keys_processed:0
# 当前保存操作中已处理的 key 数量。

current_save_keys_total:0
# 当前保存操作中总共需要处理的 key 数量。

rdb_changes_since_last_save:0
# 自上次成功保存 RDB 文件以来数据库更改次数。

rdb_bgsave_in_progress:0
# 是否有后台 RDB 保存操作正在进行：0 表示没有，1 表示有。

rdb_last_save_time:1751772395
# 上次成功保存 RDB 文件的时间戳（UNIX 时间戳）。

rdb_last_bgsave_status:ok
# 上次 RDB 持久化操作的状态：ok 表示成功，err 表示失败。

rdb_last_bgsave_time_sec:0
# 上次 RDB 持久化操作耗时（秒），0 表示非常快（小于 1 秒）。

rdb_current_bgsave_time_sec:-1
# 当前 RDB 持久化操作已经进行的时间（秒），-1 表示无进行中的操作。

rdb_saves:5
# 成功执行 RDB 持久化操作的总次数。

rdb_last_cow_size:0
# 上次 RDB 持久化操作期间使用的最大写时复制内存大小（字节）。

rdb_last_load_keys_expired:0
# 上次加载 RDB 文件时过期的 key 数量。

rdb_last_load_keys_loaded:0
# 上次加载 RDB 文件时恢复的 key 数量。

aof_enabled:0
# 是否启用了 AOF 持久化：0 表示未启用，1 表示启用。

aof_rewrite_in_progress:0
# 是否有 AOF 重写操作正在进行：0 表示没有。

aof_rewrite_scheduled:0
# 是否有 AOF 重写被调度等待执行：0 表示没有。

aof_last_rewrite_time_sec:-1
# 上次 AOF 重写耗时（秒），-1 表示未执行过。

aof_current_rewrite_time_sec:-1
# 当前 AOF 重写已经进行的时间（秒），-1 表示无进行中的操作。

aof_last_bgrewrite_status:ok
# 上次 AOF 重写操作的状态：ok 表示成功。

aof_rewrites:0
# 成功执行的 AOF 重写次数。

aof_rewrites_consecutive_failures:0
# 连续失败的 AOF 重写次数。

aof_last_write_status:ok
# 最近一次 AOF 写入状态：ok 表示正常，err 表示出错。

aof_last_cow_size:0
# 上次 AOF 重写期间使用的最大写时复制内存大小（字节）。

module_fork_in_progress:0
# 是否有模块在后台 fork 中运行：0 表示没有。

module_fork_last_cow_size:0
# 上次模块 fork 使用的最大写时复制内存大小（字节）。
```

```bash [5]
127.0.0.1:6379> INFO Threads
# Threads

io_thread_0:clients=1,reads=120,writes=115
# 表示 Redis I/O 多线程模式下，线程 0 的工作负载统计：
# - clients=1：当前有 1 个客户端连接。
# - reads=120：该线程已处理的读请求总数为 120 次。
# - writes=115：该线程已处理的写请求总数为 115 次。
```

```bash [6]
127.0.0.1:6379> INFO Stats
# Stats

total_connections_received:22
# 自 Redis 启动以来，总共接收到的客户端连接数。

total_commands_processed:73
# 自 Redis 启动以来，总共处理的命令请求数量。

instantaneous_ops_per_sec:0
# 每秒处理的命令请求数（当前值）。

total_net_input_bytes:3524
# 所有客户端发送给 Redis 的总字节数（输入流量）。

total_net_output_bytes:1133882
# Redis 返回给所有客户端的总字节数（输出流量）。

total_net_repl_input_bytes:0
# 主从复制中，从节点发送给主节点的总字节数（仅适用于主节点）。

total_net_repl_output_bytes:0
# 主从复制中，主节点发送给从节点的总字节数（仅适用于主节点）。

instantaneous_input_kbps:0.00
# 当前每秒接收的数据量（KB/s）。

instantaneous_output_kbps:0.00
# 当前每秒发送的数据量（KB/s）。

instantaneous_input_repl_kbps:0.00
# 当前主从复制中每秒接收的数据量（KB/s）。

instantaneous_output_repl_kbps:0.00
# 当前主从复制中每秒发送的数据量（KB/s）。

rejected_connections:0
# 被拒绝的连接数量（通常由于 maxclients 限制或负载过高）。

sync_full:0
# 完整同步（全量复制）请求的总数（用于主从复制）。

sync_partial_ok:0
# 成功的部分同步（增量复制）次数。

sync_partial_err:0
# 失败的部分同步（增量复制）次数。

expired_subkeys:0
# 因过期而被删除的子 key 数量（例如 Hash、List 中的元素）。

expired_keys:0
# 因过期而被删除的 key 总数。

expired_stale_perc:0.00
# 过期 key 清理时发现的“陈旧”比例（即 key 已过期但未及时清理）。

expired_time_cap_reached_count:0
# 达到最大清理时间限制的次数（Redis 使用定时任务清理过期 key）。

expire_cycle_cpu_milliseconds:5197
# 所有过期 key 清理周期所消耗的 CPU 时间（毫秒）。

evicted_keys:0
# 因内存不足而被淘汰的 key 数量（根据 maxmemory_policy 策略）。

evicted_clients:0
# 因客户端缓冲区溢出而断开的客户端数量。

evicted_scripts:0
# 因内存不足而被淘汰的 Lua 脚本数量。

total_eviction_exceeded_time:0
# 因淘汰策略执行超时的总次数。

current_eviction_exceeded_time:0
# 当前淘汰操作是否正在超时执行（0 表示否）。

keyspace_hits:6
# 成功命中 key 的次数（GET、SET 等操作）。

keyspace_misses:1
# 未命中 key 的次数（尝试访问不存在的 key）。

pubsub_channels:0
# 当前订阅的 Pub/Sub 频道数量。

pubsub_patterns:0
# 当前订阅的 Pub/Sub 模式数量。

pubsubshard_channels:0
# 分片 Pub/Sub 频道数量（Redis 7.0+ 的新特性）。

latest_fork_usec:1004
# 上次 fork 子进程耗时（微秒），如 RDB 快照保存时使用。

total_forks:4
# Redis 启动以来执行的 fork 次数（如 RDB 和 AOF 重写会触发 fork）。

migrate_cached_sockets:0
# 缓存中的 MIGRATE 套接字连接数。

slave_expires_tracked_keys:0
# 从节点上因开启了 slave-tracking-expire 而跟踪的 key 数量。

active_defrag_hits:0
# 主动反碎片化成功移动的键数量。

active_defrag_misses:0
# 主动反碎片化失败的键数量（无可用空间）。

active_defrag_key_hits:0
# 主动反碎片化过程中成功整理的 key 数量。

active_defrag_key_misses:0
# 主动反碎片化过程中失败的 key 数量。

total_active_defrag_time:0
# 主动反碎片化的累计执行时间（毫秒）。

current_active_defrag_time:0
# 当前正在进行的主动反碎片化已执行时间（毫秒）。

tracking_total_keys:0
# 启用了 CLIENT TRACKING 的 key 数量（用于 Redis 的缓存模式）。

tracking_total_items:0
# 启用了 CLIENT TRACKING 的总条目数（如哈希表桶）。

tracking_total_prefixes:0
# 启用了 CLIENT TRACKING 的前缀数量。

unexpected_error_replies:0
# Redis 内部错误导致返回 ERR 的次数。

total_error_replies:38
# Redis 返回错误的总次数（包括认证错误、语法错误等）。

dump_payload_sanitizations:0
# 对 DUMP 命令输出进行清理的次数。

total_reads_processed:121
# Redis 接收的读请求总次数。

total_writes_processed:116
# Redis 接收的写请求总次数。

io_threaded_reads_processed:0
# I/O 多线程模式下，由工作线程处理的读请求数量。

io_threaded_writes_processed:0
# I/O 多线程模式下，由工作线程处理的写请求数量。

io_threaded_total_prefetch_batches:0
# I/O 多线程预取批次总数。

io_threaded_total_prefetch_entries:0
# I/O 多线程预取条目总数。

client_query_buffer_limit_disconnections:0
# 因查询缓冲区超过限制而断开的客户端数量。

client_output_buffer_limit_disconnections:0
# 因输出缓冲区超过限制而断开的客户端数量。

reply_buffer_shrinks:18
# Redis 回复缓冲区收缩次数：表示 Redis 客户端回复缓冲区被缩小的累计次数，共 18 次。

reply_buffer_expands:4
# Redis 回复缓冲区扩展次数：表示 Redis 客户端回复缓冲区被扩大的累计次数，共 4 次。

eventloop_cycles:1694160
# 事件循环执行轮次总数：Redis 的主事件循环已经运行了 1,694,160 次。

eventloop_duration_sum:141174332
# 事件循环总耗时（微秒）：Redis 主事件循环累计消耗时间为 1,411,743.32 秒。

eventloop_duration_cmd_sum:12420
# 命令处理总耗时（微秒）：所有命令执行过程中在事件循环中所耗费的时间总和为 12,420 微秒。

instantaneous_eventloop_cycles_per_sec:9
# 当前每秒事件循环次数：当前平均每秒事件循环运行 9 次。

instantaneous_eventloop_duration_usec:77
# 当前事件循环平均耗时（微秒）：每次事件循环平均耗时 77 微秒。

acl_access_denied_auth:4
# 认证失败导致的访问拒绝次数：因认证失败（如密码错误）被拒绝的请求共计 4 次。

acl_access_denied_cmd:0
# 命令权限不足导致的访问拒绝次数：因用户没有执行某命令的权限而被拒绝的请求数，此处为 0 次。

acl_access_denied_key:0
# Key 权限不足导致的访问拒绝次数：因用户没有对某个 key 的访问权限而被拒绝的请求数，此处为 0 次。

acl_access_denied_channel:0
# 频道权限不足导致的 Pub/Sub 访问拒绝次数：因用户没有对某个频道的权限而被拒绝的 Pub/Sub 请求次数，此处为 0 次。
```

```bash [7]
127.0.0.1:6379> INFO Replication
# Replication

role:master
# 当前 Redis 实例的角色：master 表示是主节点。

connected_slaves:0
# 当前连接到该主节点的从节点数量，当前为 0，表示没有从节点连接。

master_failover_state:no-failover
# 主节点故障转移状态：no-failover 表示当前没有进行故障转移。

master_replid:0b784aafc567836136c1c036378ae1980358a826
# 主节点的唯一复制 ID（replid），用于标识本次复制流。

master_replid2:0000000000000000000000000000000000000000
# 第二个复制 ID，用于在故障转移后保持复制连续性，当前未使用。

master_repl_offset:0
# 主节点当前复制偏移量，用于同步从节点的数据位置，当前为 0。

second_repl_offset:-1
# 旧复制 ID 对应的起始偏移量，-1 表示无效或未设置。

repl_backlog_active:0
# 复制环形缓冲区是否激活：0 表示未激活，无从节点需要同步。

repl_backlog_size:1048576
# 复制环形缓冲区大小（字节）：用于缓存最近的写操作供从节点同步，默认为 1MB。

repl_backlog_first_byte_offset:0
# 环形缓冲区中最早数据的偏移量，用于计算从节点同步进度。

repl_backlog_histlen:0
# 环形缓冲区中当前可用的历史数据长度（字节），0 表示无可用数据。
```

```bash [8]
127.0.0.1:6379> INFO CPU
# CPU

used_cpu_sys:102.383210
# Redis 主进程在内核态消耗的 CPU 时间（秒）：表示系统调用（如 I/O 操作）所占用的 CPU 时间，累计约 102.38 秒。

used_cpu_user:59.869546
# Redis 主进程在用户态消耗的 CPU 时间（秒）：表示 Redis 自身逻辑处理所占用的 CPU 时间，累计约 59.87 秒。

used_cpu_sys_children:0.010768
# 子进程在内核态消耗的 CPU 时间（秒）：例如 RDB 快照或 AOF 重写子进程的系统调用耗时，累计约 0.01 秒。

used_cpu_user_children:0.000924
# 子进程在用户态消耗的 CPU 时间（秒）：表示子进程执行 Redis 内部逻辑所占用的时间，累计约 0.0009 秒。
```

```bash [9]
127.0.0.1:6379> INFO Modules
# Modules

module:name=vectorset,ver=1,api=1,filters=0,usedby=[],using=[],options=[handle-io-errors|handle-repl-async-load]
# 已加载的 Redis 模块信息：
# - name=vectorset：模块名称为 vectorset。
# - ver=1：模块版本号为 1。
# - api=1：使用的 Redis 模块 API 版本为 1。
# - filters=0：该模块未注册任何命令或键名过滤器。
# - usedby=[]：没有其他模块依赖此模块。
# - using=[]：该模块不依赖其他已加载的模块。
# - options=[handle-io-errors|handle-repl-async-load]：模块支持的选项：
#   - handle-io-errors：在 I/O 错误时通知模块。
#   - handle-repl-async-load：支持在异步加载期间处理复制数据。
```

```bash [10]
127.0.0.1:6379> INFO Errorstats
# Errorstats

errorstat_ERR:count=7
# 统计命令执行时发生的通用错误（ERR）次数，共发生了 7 次。

errorstat_NOAUTH:count=27
# 统计未通过身份验证（NOAUTH）的请求次数，共发生了 27 次。

errorstat_WRONGPASS:count=4
# 统计客户端尝试使用错误密码认证（WRONGPASS）的次数，共发生了 4 次。
```

```bash [11]
127.0.0.1:6379> INFO Cluster
# Cluster

cluster_enabled:0
# 表示当前 Redis 实例是否启用了集群模式：
# - 0：未启用集群（即单机模式）。
# - 1：已启用集群模式。
```

```bash [12]
127.0.0.1:6379> INFO Keyspace
# Keyspace

db0:keys=2,expires=0,avg_ttl=0,subexpiry=0
# 显示数据库 db0 的键空间统计信息：
# - keys=2：当前数据库中有 2 个键。
# - expires=0：没有设置过期时间的键。
# - avg_ttl=0：所有设置了过期时间的键的平均剩余生存时间（TTL）为 0 秒。
# - subexpiry=0：表示与子对象相关的过期键数量，通常用于集合、哈希等结构中，这里为 0。
```

```bash [13]
127.0.0.1:6379> INFO Keysizes
# Keysizes

db0_distrib_strings_sizes:2=1,4=1
# 显示字符串类型键的大小分布情况（仅适用于字符串类型的键）：
# - db0_distrib_strings_sizes 表示数据库 db0 中字符串键的长度分布：
#   - 长度为 2 的字符串键有 1 个。
#   - 长度为 4 的字符串键有 1 个。
```

:::

## 4. 💻 CLIENT

```bash
127.0.0.1:6379> CLIENT LIST
id=6 addr=127.0.0.1:54738 laddr=127.0.0.1:6379 fd=10 name= age=82580 idle=0 flags=N db=0 sub=0 psub=0 ssub=0 multi=-1 watch=0 qbuf=26 qbuf-free=16864 argv-mem=10 multi-mem=0 rbs=1024 rbp=0 obl=0 oll=0 omem=0 tot-mem=18810 events=r cmd=client|list user=default redir=-1 resp=2 lib-name= lib-ver= io-thread=0 tot-net-in=896 tot-net-out=242515 tot-cmds=29
# 注解说明：
id=6                     # 客户端连接的唯一ID。
addr=127.0.0.1:54738     # 客户端的IP地址和端口号。
laddr=127.0.0.1:6379     # 服务器监听的本地IP地址和端口号。
fd=10                    # 客户端套接字描述符。
name=                    # 客户端名称，未设置。
age=82580                # 连接已经持续的时间（秒）。
idle=0                   # 最后一次与服务器交互的时间间隔（秒）。
flags=N                  # 客户端标志位，N表示普通客户端。
db=0                     # 当前使用的数据库编号。
sub=0                    # 订阅的频道数量。
psub=0                   # 订阅的模式数量。
ssub=0                   # 从节点订阅的主节点频道数量。
multi=-1                 # 事务中的命令数量，-1表示不在事务中。
watch=0                  # 监视的键数量。
qbuf=26                  # 查询缓冲区大小（字节），用于存储客户端发送的命令。
qbuf-free=16864          # 查询缓冲区剩余空间大小（字节）。
argv-mem=10              # 参数内存使用量（字节）。
multi-mem=0              # 事务内存使用量（字节）。
rbs=1024                 # 接收缓冲区大小（字节）。
rbp=0                    # 接收缓冲区偏移量。
obl=0                    # 输出缓冲区长度。
oll=0                    # 输出列表长度。
omem=0                   # 输出缓冲区内存使用量（字节）。
tot-mem=18810            # 客户端总内存使用量（字节）。
events=r                  # 当前客户端等待的事件类型，r表示可读。
cmd=client|list          # 最后执行的命令。
user=default             # 用户名，默认用户。
redir=-1                 # 客户端重定向状态。
resp=2                   # 客户端响应协议版本。
lib-name=                # 客户端库名称，未设置。
lib-ver=                 # 客户端库版本号，未设置。
io-thread=0              # I/O线程编号。
tot-net-in=896           # 客户端网络输入流量总量（字节）。
tot-net-out=242515       # 客户端网络输出流量总量（字节）。
tot-cmds=29              # 客户端发送的命令总数。
```
