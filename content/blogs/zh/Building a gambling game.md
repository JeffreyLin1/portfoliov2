# 做一个赌博游戏

_2026 年 3 月 6 日_

![Jello 游戏画面](/jello-2.jpg)

几个月前，我和一个朋友做了一个 Paper.io 的克隆版，
但玩家押的是真钱，并且按表现来提现。

做这个项目的过程非常有意思，我也学到了很多，
所以想把做 Jello.gg 的整个过程写下来。

## 目录

- [灵感来源](#灵感来源)
- [计划](#计划)
- [做前端界面](#做前端界面)
  - [赛前界面](#赛前界面)
  - [游戏内界面](#游戏内界面)
  - [游戏渲染器](#游戏渲染器)
- [做后端](#做后端)
  - [控制面](#控制面)
  - [游戏服务器](#游戏服务器)
- [做赌博系统](#做赌博系统)
- [推广](#推广)
- [经验教训](#经验教训)

## 灵感来源

老实说，在 Shopify 上班把我无聊坏了——我很怀念做有争议的东西时那种肾上腺素飙升的感觉。

我就想做一个赌博游戏。一个玩家之间互相厮杀的游戏。而且不能像扑克那样无聊。

这个想法已经有人成功做过了，比如 noodle.gg 和 damnbruh.com。

不过这两个都是基于 Slither.io 的，我想了想，决定改用 Paper.io，做点不一样的。

## 计划

在开始考虑技术栈之前，我得先解决一个问题：

_我会不会因为这个被抓起来？？_

### 合法性

我有几个选择：

- 赚钱，然后祈祷没人举报
- 赚钱，在库拉索或墨西哥注册公司来规避监管
- 一分钱不赚，希望真出事了还能说自己是无辜的

在咨询了我的律师（Grok 和 ChatGPT）之后，我的结论是：我们一分利润都不拿，然后祈祷我不会进监狱。

![bruh](/nose2.png)
_bruh_

### 赌博机制

玩家到底怎么赚钱、怎么亏钱？

我定下了这样的游戏流程（如果你不了解 Paper.io 的玩法，这段可能有点难懂）：

1. __选择赌注__：1 美元、5 美元或 10 美元。
2. __进入队列__。这个我是直接抄英雄联盟的。
3. __凑齐 6 名玩家后开局__，60 秒倒计时开始。
4. __所有玩家的赌注__ 进入一个总奖池。你占总领地的百分比，就是你能拿走奖池的百分比。
5. __击杀玩家__ = 拿走他的领地 = 拿走他的钱。
6. __时间结束时__，所有玩家按占有的领地提现。如果只剩你一个人，整个奖池都归你。

_听起来挺简单，但说实话，这套规则是反复迭代和琢磨了很久才定下来的。_

### 技术栈

前端用 React + Pixi，部署在 S3 和 CloudFront 上。
后端用 Node + Express，游戏通过 ECS Fargate 连接，排队系统用 ElastiCache 上的 Redis 实现。

Web3 部分用 Solana + Helius + Privy。

全部用 TypeScript 写的。我之所以全套用 AWS，纯粹是因为我从 YC AI startup school 拿到了 2.5 万美元的额度。

## 做前端界面

这块我是__一点__都没省力气。我希望这个游戏玩起来真的爽，
而且因为用的是真钱，它必须让人信得过。

### 赛前界面

游戏和加密货币结合的问题在于，第一眼看上去往往很复杂、很反直觉，所以我特意避免了这一点。

![alt](/jellopre-game.png)

BOOM。
我在设计上用了粗野主义风格，并参考了 DamnBruh（类似的游戏）。我很喜欢他们用网格布局做出的那种直观感。

### 游戏内界面

游戏内界面没那么难做。简单的排行榜，一些不错的动画，等等。

有一个改动效果特别明显：一个在你占领领地时实时显示你赚到多少 $$$ 的动画。改动很小，但对游戏爽感的提升非常大。

### 游戏渲染器

说实话，如果直接用 3D 渲染，这块会简单很多，但我想让性能尽可能好，所以避开了 3D。

渲染器基本上就是这么个流程：

1. __Pixi 渲染器__ 创建若干图层（背景、玩家、文字）
2. __处理玩家转向角度__，避免 179 到 -179 这种边界情况导致整个模型转一圈。
3. __选取一个就近的角度档位__，然后复用该角度已缓存的方块绘制结果。
4. __绘制方块__：旋转各个角点，再把它们压平到屏幕空间。通过计算法线和相机方向的点积，只绘制应该可见的那些面。
5. __绘制地面阴影__，思路一样：如果某条边朝向相机，
   就画出一面侧墙，并根据它朝向我们的程度来调整色调。

要把 3D 点投影到 2D 画布上：

```ts 
(x' = x - y, y' = (x + y) - z * 0.6)
```

我们可以用类似这个简化版的公式把它画出来。

我遇到的一个问题是动画卡顿。服务器每个 tick 才发送一次位置、朝向等信息，然后渲染器把所有东西画到屏幕上。

这会让画面看起来很卡，因为玩家像是在各个位置之间瞬移。要解决这个问题，我们用「插值」。它可以归结为两个简单的概念：

1. __把帧混合起来__，做出平滑的动画。我们计算一个混合系数，然后对位置做线性插值。
2. __预测下一个位置__，用一个简单的速度方向公式。

游戏渲染器极度简化之后，大概可以写成这样：

```ts
  // 图层设置
  const root = new Container()
  root.addChild(backgroundLayer)
  root.addChild(territoryLayer)
  root.addChild(playerLayer)
  root.addChild(textLayer)
  app.stage.addChild(root)

  // 快照平滑处理（在两次网络 tick 之间）
  function buildRenderState(prev, latest, elapsedMs) {
    if (!prev) return predict(latest, elapsedMs)
    return interpolate(prev, latest, t)
  }

  // 绘制单个玩家
    drawTrail(p.activePath, p.color)
    drawHeadCube(p.head, p.heading, p.color)
    drawName(p.username, p.head)
  }

  // 相机变换
  root.scale.set(scale)
  root.position.set(
    viewportWidth / 2 - cameraTarget.x * scale,
    viewportHeight / 2 - cameraTarget.y * scale
  )
```

把这些拼在一起，你就能得到这样的效果！

![游戏画面](/jellogameplay.png)

_这个说实话花了整整一周_

## 做后端

老实说，后端大概是整个技术栈里最简单的部分。

核心思路是：用一个权威服务器来决定所有游戏状态，这样对所有玩家才公平。

后端可以拆成两部分——控制面和游戏服务器。

### 控制面

控制面负责 HTTP 和匹配。
它处理鉴权、预留/激活入场券、按赌注金额分组排队等等。

当队列里凑够玩家后，匹配系统会创建一个待定房间，等待必要的检查通过。

之后它会激活房间，并把客户端通过 WebSocket 连接所需的信息发过去。

```ts
// 控制面（简化版）
app.post("/match/reserve", (req, res) => res.json(matchmaker.reserve(req.user.id, req.body.stake)))
app.post("/match/activate", async (req, res) => res.json(await matchmaker.activate(req.user.id, req.body.ticketId)))
setInterval(() => matchmaker.tryFormAndActivate(), 400)
```

### 游戏服务器

客户端发送诸如转向变化之类的输入，然后服务器以固定 tick 运行模拟，来决定最终的位置、碰撞、占领和淘汰。

每个 tick，房间都会更新状态并向玩家发送一份快照。对局结束时，它会计算最终的领地分布，敲定结果并触发结算。

```ts
// 权威游戏服务器（简化版）
wss.on("connection", (socket, req) => roomManager.get(getRoomId(req))?.attach(socket))

class GameRoom {
  onInput(player, { heading }) { player.targetHeading = heading } // 玩家意图
  tick() {
    updateMovement(this.players)
    resolveCollisions(this.players)
    resolveTerritory(this.players)
    this.broadcast({ type: "snapshot", snapshot: this.buildSnapshot() })
    if (this.isOver()) treasury.sendPayouts(this.id, this.computeResults().payouts)
  }
}
```

## 做赌博系统

因为做这个项目的时候我对 Web3 一无所知，所以我自己没做任何链上的东西，
支付逻辑全部放在服务器代码里。

目标很简单：让用户能存钱、排队进入对局、拿回一些钱，整个过程要快且顺畅。

我选的是 Solana 上的 USDC。我本来就对 Solana 比较熟（感谢 pump.fun），而且用 USDC 意味着数字看起来会很好看（我实在想不出还能怎么在不烧 API key 的情况下把 SOL 换算成美元）。

所有的活基本上都交给第三方工具处理了：

- __Privy：__ 账号创建，给每个用户配一个内嵌钱包，这样他们直接往那个钱包里存钱就行
- __Helius：__ 与链交互，获取钱包余额、价格换算、结算、提现等等

服务端的结算系统基本上就是这样：

```ts
  await ledger.credit(userId, depositAmount, "deposit")
  await ledger.reserve(userId, stakeAmount, "match_stake")
  await ledger.payout(userId, winnings, "match_result")
  await treasury.withdraw(userId, withdrawAmount, destinationWallet)
```

_耶，我不用碰链了！_

我真的很想感谢 Privy 和 Helius 背后的团队，没有他们的工程实力，这个项目根本不可能做出来。非常感谢

## 推广

一开始我做调研，发现类似的游戏都有 Discord 群、抽奖活动、切片推广计划等等。

那时候我不想搞这些。

我就注册了一个 X 账号 @playjello，仅此而已。发了个上线视频，来了几个玩家，但没什么大动静。

一个月后，X 上有陌生人让我发币，于是我在 Bags 上发了 $PLAYJELLO。顺便说一句，我当时完全不知道自己在干嘛。

然后几分钟内就有几百个人／机器人在买这个币，我还在和北京的一些陌生中国人开电话会议，试图搞懂什么叫「上 DEX」、什么叫「做 X 社区」。

![x1](/X1.png)

这时候游戏里已经有大概一百个玩家连续在线了，我的基础设施被结结实实地压测了一把。

我花了 200 美元把币挂到 Dex Screener 上，但因为我完全不懂在干什么，所有的热度在一个小时之内就散了。

![x2](/X2.png)

大家人都特别好，是真心想帮我，我挺过意不去的，关键时刻没能顶住。不过我确实靠手续费赚了大概一千美元，这点还行。

## 经验教训

我在合法性这件事上想得太多了。实际上除非我赚了上百万美元之类的，否则真没那么严重。

一开始我以为这个项目里最好玩的部分会是推广，结果最好玩的反而是工程本身。学习 WebSocket、安全和 Web3 架构真的非常带劲。我在 X 营销、YouTube Shorts 切片这些事情上花的时间太多了。

还有，加密货币社区是真的挺吓人的。

总之游戏现在还开着（虽然基本没人了）-> [jello.gg](https://jello.gg)

感谢 [Kevin Wang](https://x.com/k3vinwvng) 和我一起做这个项目！
![working](/working2.png)
