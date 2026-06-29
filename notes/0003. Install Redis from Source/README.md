# [0003. Install Redis from Source](https://github.com/tnotesjs/TNotes.redis/tree/main/notes/0003.%20Install%20Redis%20from%20Source)

<!-- region:toc -->

- [1. 概述](#1-概述)
- [2. 从源码安装 Redis（以 macos 为例）](#2-从源码安装-redis以-macos-为例)
- [3. References](#3-references)

<!-- endregion:toc -->

## 1. 概述

- 记录从源代码安装 Redis 的步骤。
- 本节记录的流程主要以 macOS 为例。
  - 这种安装方式也同时适用于 Windows 系统。
  - 注：需要启用 WSL（Windows Subsystem for Linux）

## 2. 从源码安装 Redis（以 macos 为例）

::: code-group

```bash [macos]
# 安装 Xcode 命令行工具（如果还没有安装）
xcode-select --install

# 下载 Redis 源码包
cd /tmp # 切换到临时目录，作为下载和编译 Redis 的工作空间
curl -O https://download.redis.io/redis-stable.tar.gz
tar -xzvf redis-stable.tar.gz
cd redis-stable

# 编译 Redis
make

make test # 可选：运行测试确认是否编译成功
# 如果测试全都通过了，那么会打印：
# \o/ All tests passed without errors!

# 安装 Redis 到系统目录
sudo make install
```

```bash [windows]
# 启用 WSL（Windows Subsystem for Linux）
# 打开 PowerShell（以管理员身份运行）
# 输入以下命令启用 WSL：
wsl --install
# 然后输入用户名密码创建 Linux 用户。

# 更新软件包并安装编译工具
sudo apt update && sudo apt upgrade -y
sudo apt install build-essential tcl git -y

# 后续步骤相同
cd /tmp
curl -O https://download.redis.io/redis-stable.tar.gz
tar -xzvf redis-stable.tar.gz
cd redis-stable
make
make test
sudo make install
```

:::

## 3. References

- https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/install-redis-from-source/
  - 官方文档 - Install Redis from Source
- https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/
  - 官方文档 - 介绍了安装 redis 的其他方式，以及在 Windows 和 Linus 等环境下如何安装。
