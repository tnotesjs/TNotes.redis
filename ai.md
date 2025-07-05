# 1 - lua 脚本示例

### ✅ 示例 3：使用 SCRIPT LOAD 和 EVALSHA 缓存脚本

如果你经常执行同一个脚本，可以先将其加载到缓存中，后续使用 SHA 标识符调用。

```bash
# 加载脚本到缓存
SCRIPT LOAD "return redis.call('GET', KEYS[1])"

# 假设返回的 SHA 是 "86f7e437faa5a7fce15d1ddcb9eaeaea35782b59"

# 使用 EVALSHA 执行脚本
EVALSHA 86f7e437faa5a7fce15d1ddcb9eaeaea35782b59 1 key1
```

**输出结果：**

```
"value1"
```

> - `SCRIPT LOAD` 将脚本保存在 Redis 内部缓存中；
> - `EVALSHA` 可以通过 SHA 来重复调用该脚本，提高性能并减少网络传输。

### ✅ 示例 4：检查某个键是否存在，如果存在则设置值（类似 SETNX）

```bash
# 使用 Lua 脚本实现 SETNX 功能
EVAL "if redis.call('GET', KEYS[1]) == false then redis.call('SET', KEYS[1], ARGV[1]); return 1; else return 0; end" 1 lock_key my_value
```

**输出结果（第一次运行）：**

```
(integer) 1
```

**输出结果（第二次运行）：**

```
(integer) 0
```

> 这个脚本实现了类似 `SETNX` 的功能，但更灵活，可扩展支持 TTL 等逻辑。

### ✅ 示例 5：批量删除匹配模式的键（如 keys _session:_）

```bash
# 添加几个测试键
SET session:user:1001 "abc"
SET session:user:1002 "def"
SET session:user:1003 "ghi"

# 使用 Lua 脚本删除所有 session:user:* 键
EVAL "local keys = redis.call('keys', 'session:user:*'); for i=1,#keys do redis.call('del', keys[i]); end; return #keys;" 0
```

**输出结果：**

```
(integer) 3
```

> 说明成功删除了 3 个键。注意：`KEYS` 操作在大数据量时会影响性能，生产环境建议使用 `SCAN` 替代。

### 🧠 小结：Lua 脚本的优势

| 优势            | 描述                                        |
| --------------- | ------------------------------------------- |
| 🔐 原子性       | 多个 Redis 命令打包成一个脚本，保证原子执行 |
| ⚡ 减少网络往返 | 多条命令只需一次请求                        |
| 🧩 可复用       | 使用 `SCRIPT LOAD` + `EVALSHA` 提高性能     |
| 📦 逻辑控制     | 支持 if/else、循环、函数等复杂逻辑          |

---

你也可以将这些示例整合进你的文档中，让 `## 4. 💻 Redis 脚本` 更加完整实用 ✅

如果你需要我为你提供 Node.js 或其他语言客户端中调用 Redis 脚本的示例，也可以告诉我 😄
