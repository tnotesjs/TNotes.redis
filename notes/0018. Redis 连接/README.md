# [0018. Redis 连接](https://github.com/tnotesjs/TNotes.redis/tree/main/notes/0018.%20Redis%20%E8%BF%9E%E6%8E%A5)

<!-- region:toc -->

- [1. 概述](#1-概述)
- [2. Redis 连接](#2-redis-连接)
- [3. 连接 Redis 服务](#3-连接-redis-服务)

<!-- endregion:toc -->

## 1. 概述

- 了解 Redis 连接的相关命令及其基本使用。

## 2. Redis 连接

- Redis 连接命令主要是用于连接 redis 服务。

```bash
# 连接 redis 服务
redis-cli -h <127.0.0.1> -p <6379>

# 设置认证密码
CONFIG SET requirepass <密码>
# 相当于给默认用户 default 添加了访问权限

# 验证密码是否正确
AUTH password
# 相当于：AUTH default password
# 其中 default 是用户名，password 是密码

# 查看当前用户信息
ACL WHOAMI
# 输出示例："default"
# 表示当前用户是 default

# 查看服务是否运行
PING

# 关闭当前连接
QUIT

# 切换连接的数据库
SELECT index
```

## 3. 连接 Redis 服务

::: code-group

```bash [无需认证]
# 未设置密码的时候执行以下命令
redis-cli # 启动一个 redis 客户端

# 测试连接
PING
# PONG
# 说明这时候无需认证，即可访问 redis 服务器。

# 关闭连接
QUIT
```

```bash [需要认证]
# 设置认证密码
CONFIG SET requirepass dahuyou
# OK
# 删除密码的话，只需要将密码清空即可。
# CONFIG SET requirepass ""

redis-cli # 启动一个 redis 客户端

# 测试连接
PING
# (error) NOAUTH Authentication required.
# 报错了，表示连接失败，提示说明你需要认证，才能访问 redis 服务器。

# 输入密码完成授权
auth 123
# (error) WRONGPASS invalid username-password pair or user is disabled.
# 报错了，表示密码错误。

# 测试连接
PING
# (error) NOAUTH Authentication required.
# 此时测试连接，会得到相同的报错。

AUTH dahuyou
# OK
# 说明密码正确

# 测试连接
PING
# PONG
# 表示连接成功了，接下来就可以和 redis 服务进行交互了。

# 关闭连接
QUIT
```

:::
