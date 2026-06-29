# [0020. Redis GEO](https://github.com/tnotesjs/TNotes.redis/tree/main/notes/0020.%20Redis%20GEO)

<!-- region:toc -->

- [1. 概述](#1-概述)
- [2. Redis GEO](#2-redis-geo)
- [3. `geoadd`](#3-geoadd)
- [4. `geopos`](#4-geopos)
- [5. `geodist`](#5-geodist)
- [6. `georadius`、`georadiusbymember`](#6-georadiusgeoradiusbymember)
- [7. `geohash`](#7-geohash)
- [8. References](#8-references)

<!-- endregion:toc -->

## 1. 概述

- 了解 Redis GEO 的基本使用。

## 2. Redis GEO

Redis GEO 主要用于存储 **地理位置信息**，并对存储的信息进行操作，该功能在 Redis 3.2 版本新增。

Redis GEO 操作方法有：

- `geoadd`：添加地理位置的坐标。
- `geopos`：获取地理位置的坐标。
- `geodist`：计算两个位置之间的距离。
- `georadius`：根据用户给定的经纬度坐标来获取指定范围内的地理位置集合。
- `georadiusbymember`：根据储存在位置集合里面的某个地点获取指定范围内的地理位置集合。
- `geohash`：返回一个或多个位置对象的 geohash 值。

## 3. `geoadd`

- geoadd 用于存储指定的地理空间位置，可以将一个或多个经度(longitude)、纬度(latitude)、位置名称(member)添加到指定的 key 中。
- geoadd 语法格式如下：

```bash
GEOADD key longitude latitude member [longitude latitude member ...]
```

- 以下实例中 key 为 Sicily，Palermo 和 Catania 为位置名称：

```bash
GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
# (integer) 2
# 使用 geoadd 命令将两个地理位置添加到 key 为 Sicily 的集合中。
# "Palermo" 的经纬度是 (13.361389, 38.115556)。
# "Catania" 的经纬度是 (15.087269, 37.502669)。
# 返回值 (integer) 2 表示成功添加了两个位置。

GEODIST Sicily Palermo Catania
# "166274.1516"
# 计算 Sicily 集合中 "Palermo" 和 "Catania" 之间的距离。
# 返回值 "166274.1516" 是两者之间的距离，单位为米。

GEORADIUS Sicily 15 37 100 km
# 1) "Catania"
# 查询以经纬度 (15, 37) 为中心，半径 100 千米范围内的所有地理位置。
# 结果为 1) "Catania"，表示 "Catania" 在指定范围内。

GEORADIUS Sicily 15 37 200 km
# 1) "Palermo"
# 2) "Catania"
# 查询条件同上，但半径增加到 200 千米。
# 返回结果包含 "Palermo" 和 "Catania"，说明两者都在该范围内。
```

> - **Sicily**：西西里岛，是地中海最大的岛屿，位于意大利南部，常用于示例地理数据的存储集合。
> - **Palermo**：巴勒莫，是西西里岛的首府，位于岛屿的西北海岸，具有典型的地中海气候。
> - **Catania**：卡塔尼亚，位于西西里岛东岸，靠近埃特纳火山，是岛上重要的工业与旅游城市。

## 4. `geopos`

- geopos 用于从给定的 key 里返回所有指定名称(member)的位置（经度和纬度），不存在的返回 nil。
- geopos 语法格式如下：

```bash
GEOPOS key member [member ...]
```

```bash
GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
# (integer) 2

GEOPOS Sicily Palermo Catania NonExisting
# 1) 1) "13.361389338970184"
#    2) "38.1155563954963"
# 2) 1) "15.087267458438873"
#    2) "37.50266842333162"
# 3) (nil)

# GEOPOS Sicily Palermo Catania NonExisting
# 表示从 key 为 Sicily 的 GEO 集合中获取成员 Palermo、Catania 和 NonExisting 的地理位置坐标。

# 1) 1) "13.361389338970184"
#    2) "38.1155563954963"
# 这是 Palermo 的经纬度坐标：
# 经度（longitude）：13.36138933897018433
# 纬度（latitude）：38.11555639549629859

# 2) 1) "15.087267458438873"
#    2) "37.50266842333162"
# 这是 Catania 的经纬度坐标：
# 经度（longitude）：15.08726745843887329
# 纬度（latitude）：37.50266842333162032

# 3) (nil)
# NonExisting 是一个不存在于 Sicily 集合中的成员，因此其结果为 (nil)，表示该成员没有对应的地理位置数据。
```

- **🤔 为什么通过 geopos 读取到的精度比 geoadd 写入时要高？**
  - 通过 `GEOPOS` 读取到的经纬度精度比写入时更高的原因是 **Redis 内部使用更高精度的浮点数存储地理坐标**，而 `GEOADD` 命令在写入时允许用户输入较低精度的数值（如保留 6 位小数），但这并不意味着实际存储的就是这个精度。
  - **Redis 使用 52 位 geohash 存储地理位置**：
    - Redis GEO 底层基于有序集合（sorted set）实现，每个 member 的 score 是一个 52 位的 geohash 编码值。
    - 这个 geohash 能够表示非常精确的位置信息，其精度可达 **几厘米级别**。
  - **写入时接受有限精度的输入，但内部转换为高精度浮点数**：
    - 用户写入时可能只提供少量小数位数（如 `13.361389` 只有 6 位），但 Redis 会将其转换为更高精度的浮点数进行存储。
    - 示例中写入的是 `13.361389`，但读出的是 `13.36138933897018433`，说明内部存储使用了双精度浮点数（double）。
  - **geopos 返回的是原始浮点值的字符串表示**：
    - 当调用 `GEOPOS` 读取坐标时，返回的是内部存储的完整浮点数的字符串形式，因此显示出了更高的小数位数。
  - **不会丢失精度的转换机制**：
    - Redis 在接收地理坐标时，会将经纬度转换为标准的 WGS84 坐标系统下的浮点数值。
    - 即使输入精度较低，最终都会被标准化并保留尽可能多的小数位，以确保后续计算（如距离、范围查询）的准确性。

| 操作 | 精度表现 | 原因 |
| --- | --- | --- |
| `GEOADD` 写入 | 用户可输入低精度（如 6 位小数） | 接口友好，便于手动测试或脚本编写 |
| `GEOPOS` 读取 | 显示高精度（15~17 位小数） | Redis 内部使用 double 存储，并返回完整数值 |

## 5. `geodist`

- geodist 用于返回两个给定位置之间的距离。
- geodist 语法格式如下：

```bash
GEODIST key member1 member2 [m|km|ft|mi]
```

- member1 member2 为两个地理位置。
- 最后一个距离单位参数说明：
  - m：米，默认单位。
  - km：千米。
  - mi：英里。
  - ft：英尺。
- 示例：计算 Palermo 与 Catania 之间的距离：

```bash
GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
# (integer) 2

GEODIST Sicily Palermo Catania
# "166274.1516"

GEODIST Sicily Palermo Catania km
# "166.2742"

GEODIST Sicily Palermo Catania mi
# "103.3182"

GEODIST Sicily Foo Bar
# (nil)
```

> 转换关系：`1km = 0.621371mi = 0.3048ft`

## 6. `georadius`、`georadiusbymember`

- georadius 以给定的经纬度为中心， 返回键包含的位置元素当中， 与中心的距离不超过给定最大距离的所有位置元素。
- georadiusbymember 和 GEORADIUS 命令一样， 都可以找出位于指定范围内的元素， 但是 georadiusbymember 的中心点是由给定的位置元素决定的， 而不是使用经度和纬度来决定中心点。
- georadius 与 georadiusbymember 语法格式如下：

```bash
GEORADIUS key longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]

GEORADIUSBYMEMBER key member radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]
```

- 参数说明：
  - m：米，默认单位。
  - km：千米。
  - mi：英里。
  - ft：英尺。
  - WITHDIST：在返回位置元素的同时， 将位置元素与中心之间的距离也一并返回。
  - WITHCOORD：将位置元素的经度和纬度也一并返回。
  - WITHHASH：以 52 位有符号整数的形式， 返回位置元素经过原始 geohash 编码的有序集合分值。 这个选项主要用于底层应用或者调试， 实际中的作用并不大。
  - COUNT：限定返回的记录数。
  - ASC：查找结果根据距离从近到远排序。
  - DESC：查找结果根据从远到近排序。

::: code-group

```bash [georadius]
GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
# (integer) 2

GEORADIUS Sicily 15 37 200 km WITHDIST
# 1) 1) "Palermo"
#    1) "190.4424"     # Palermo 距离中心点 (15, 37) 约 190.44 千米
# 2) 1) "Catania"
#    1) "56.4413"      # Catania 距离中心点 (15, 37) 约 56.44 千米

GEORADIUS Sicily 15 37 200 km WITHCOORD
# 1) 1) "Palermo"
#    1) 1) "13.36138933897018433"   # Palermo 的经度
#       1) "38.11555639549629859"   # Palermo 的纬度
# 2) 1) "Catania"
#    1) 1) "15.08726745843887329"   # Catania 的经度
#       1) "37.50266842333162032"   # Catania 的纬度

GEORADIUS Sicily 15 37 200 km WITHDIST WITHCOORD
# 1) 1) "Palermo"
#    1) "190.4424"                  # Palermo 距离中心点的距离（千米）
#    2) 1) "13.36138933897018433"   # Palermo 的经度
#       1) "38.11555639549629859"   # Palermo 的纬度
# 2) 1) "Catania"
#    1) "56.4413"                   # Catania 距离中心点的距离（千米）
#    2) 1) "15.08726745843887329"   # Catania 的经度
#       1) "37.50266842333162032"   # Catania 的纬度
```

```bash [georadiusbymember]
GEOADD Sicily 13.583333 37.316667 "Agrigento"
# (integer) 1
GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
# (integer) 2
GEORADIUSBYMEMBER Sicily Agrigento 100 km
# 1) "Agrigento"
# 2) "Palermo"
```

:::

## 7. `geohash`

- Redis GEO 使用 geohash 来保存地理位置的坐标。
- geohash 用于获取一个或多个位置元素的 geohash 值。
- geohash 语法格式如下：

```bash
GEOHASH key member [member ...]
```

```bash
GEOADD Sicily 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"
# (integer) 2

GEOHASH Sicily Palermo Catania
# 1) "sqc8b49rny0"     # Palermo 的 geohash 编码，表示其地理位置的字符串编码值
# 2) "sqdtr74hyu0"     # Catania 的 geohash 编码，用于高效存储和查询地理坐标
```

## 8. References

- https://zh.wikipedia.org/zh-cn/%E4%B8%96%E7%95%8C%E5%A4%A7%E5%9C%B0%E6%B5%8B%E9%87%8F%E7%B3%BB%E7%BB%9F
  - wiki
  - 世界大地测量系统（英语：World Geodetic System, WGS）是一种用于地图学、大地测量学和导航（包括全球定位系统）的大地测量系统标准。
