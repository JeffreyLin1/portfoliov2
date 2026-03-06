# Building a gambling game
_March 6, 2026_

![Jello gameplay](/jello-2.jpg)

A few months ago, a friend and I built a Paper.io clone but players gamble
real money and cash out based on performance. 

I had a ton of fun and learned a lot
building this out so I thought I'd walk through
my process in creating Jello.gg.



## Table of Contents
- [Inspiration](#inspiration)
- [The plan](#the-plan)
- [Building the UI](#building-the-ui)
    - [Pre-game screen](#pre-game-screen)
    - [In-game screen](#in-game-screen)
    - [Game renderer](#game-renderer)
- [Building the backend](#building-the-backend)
    - [Control plane](#control-plane)
    - [Game server](#game-server)
- [Building the gambling](#building-the-gambling)
- [Distribution](#distribution)
- [Lessons learned](#lessons-learned)

## Inspiration
Honestly, working at Shopify bored the hell out of me — I missed the adrenaline from 
building controversial things. 

I thought about making a gambling game. One where people fight eachother. Also can't be boring like Poker.

There's already been successful executions of this idea, namely noodle.gg and damnbruh.com. 

These are both based off Slither.io though, and after some thinking I settled on Paper.io instead to be different.

## The plan

Before I could even begin thinking about tech stack, I had to get something out of the way:

_Am I gonna get arrested for this??_

### Legality
I had a couple options: 
- Profit, pray nobody reports
- Profit, incorporate in Curacao, Mexico to avoid the government
- Don't take any profit and hope I can plead innocent

After consulting with my lawyers (Grok and ChatGPT), I concluded that we just won't take any profit and PRAY that I dont end up in prison. 

### Gambling mechanisms
How are people actually gonna make/lose money?

I decided on this game flow (if you don't understand how Paper.io works already it'll be hard to understand this):

1. __Pick a wager__: $1, $5, or $10.
2. __Enter queue__. I stole this straight out of League of Legends. 
3. __Game starts__ when 6 players are queued. 60 second timer starts.
4. __All players wager amount__ is placed into a global pot. your % owned of the total player territory = your % of the pot.
5. __Killing players__ = you get their territory = you get their money.
6. __When the time is up__, all players cash out based on territory owned. Last one standing = you get all the money in the pot.

_Sounds simple enough, but honestly took a lot of iteration and thinking to get to these rules._

### Tech stack

React + Pixi for the frontend, hosted on S3 and CloudFront.
Node + Express for backend, game connected via ECS Fargate and queuing built with Redis on ElastiCache.

Solana + Helius + Privy for web3.

Written all in typescript.

## Building the UI

I did __NOT__ hold back on this. I wanted the game to actually
feel satisfying to play, and since you're using actual money, it needs to be trustable.

### Pre-game screen

The problem with gaming and crypto is that it often looks complicated and unintuitive at first glance, so I made sure to prevent that.

![alt](/jellopre-game.png)

BOOM.
I used a brutalist approach to the design, and took inspiration from DamnBruh (similar game). I liked how their design was intuitive with the grid layout. 

### In-game screen

The in game screen wasn't as hard to get right. Simple leaderboard, some nice animations, etc. 

One thing that made a huge difference was an animation showing the $$$ you were earning in real time as you captured territory. Small, yet impactful change in gameplay satisfaction.


### Game renderer

This honestly would've been easy if we just used 3d rendering, but I wanted it to be as performant as possible so avoided it. 

The renderer basically just follows this procedure:

1. __Pixi Renderer__ creates layers (background, players, text)
2. __Clean player turn angles__ so edge cases like 179 to -179 doesn’t cause an entire spin.
3. __Pick a nearby angle step__ then reuse a cached cube drawing for that angle.
4. __Draw the cube__ by rotating corner points, then squashing them into the screen space. Only draw the faces that should be visible by computing the dot product of the normal and camera direction.
5. __Draw land shading__ w/ the same idea: if an edge faces the camera,
draw a side wall and tint it based on how much it faces us.

To actually project 3d points onto a 2d canvas:
```ts 
(x' = x - y, y' = (x + y) - z * 0.6)
```
We can use a formula similar to this simplified version to draw it out.

A problem I faced was laggy animations. The server sends locations, heading, etc. once every tick, then the renderer draws everything on screen. 

This makes it look laggy because players are just sort of telporting to spots. To fix this, we use 'interpolation'. It can be boiled down to 2 simple concepts:
1. __Blend frames together__ with smooth animations. We compute
  a blend value, then lerp positions.
2. __Predict next locations__ using a simple velocity direction formula

The game renderer extremely simplified can be written as something like:
```ts
  // Layer setup
  const root = new Container()
  root.addChild(backgroundLayer)
  root.addChild(territoryLayer)
  root.addChild(playerLayer)
  root.addChild(textLayer)
  app.stage.addChild(root)

  // Snapshot smoothing (between network ticks)
  function buildRenderState(prev, latest, elapsedMs) {
    if (!prev) return predict(latest, elapsedMs)
    return interpolate(prev, latest, t)
  }

  // Draw one player
    drawTrail(p.activePath, p.color)
    drawHeadCube(p.head, p.heading, p.color)
    drawName(p.username, p.head)
  }

  // Camera transform
  root.scale.set(scale)
  root.position.set(
    viewportWidth / 2 - cameraTarget.x * scale,
    viewportHeight / 2 - cameraTarget.y * scale
  )
```
When you put all this together, you get something like
this!

![gameplay](/jellogameplay.png)

_this was lowkey a whole week of work_
## Building the backend 

Honestly, the backend was probably the easiest part of the stack. 

The main idea is to have an authoritative server state that decides all game state so its fair to all players.

The backend can be split into 2 parts — the control plane, and the game server.

### Control plane
The control plane is HTTP + matchmaking.
It handles auth, reserve/activating tickets, queue grouping by wager amount, etc. 

Once enough players are in a queue, matchmaking creates a pending room and waits for required
checks to pass. 

After that, it activates the room and gives clients the info they need to connect over WebSocket.
```ts
// Control plane (simplified)
app.post("/match/reserve", (req, res) => res.json(matchmaker.reserve(req.user.id, req.body.stake)))
app.post("/match/activate", async (req, res) => res.json(await matchmaker.activate(req.user.id, req.body.ticketId)))
setInterval(() => matchmaker.tryFormAndActivate(), 400)
```

### Game server
  The client side sends inputs like heading changes, then the server runs a simulation on a
  fixed tick to decide final positions, collisions, captures and eliminations. 

  Every tick, the room updates state and sends a snapshot to the players. On match end, it computes final area spread, finalizes results and triggers
  the payouts. 
```ts
// Authoritative game server (simplified)
wss.on("connection", (socket, req) => roomManager.get(getRoomId(req))?.attach(socket))

class GameRoom {
  onInput(player, { heading }) { player.targetHeading = heading } // player intent
  tick() {
    updateMovement(this.players)
    resolveCollisions(this.players)
    resolveTerritory(this.players)
    this.broadcast({ type: "snapshot", snapshot: this.buildSnapshot() })
    if (this.isOver()) treasury.sendPayouts(this.id, this.computeResults().payouts)
  }
}
```

## Building the gambling
Since I didn't know anything about web3 when building this, I didn't do anything on-chain myself
and just kept payment logic in server code. 

The goal was simple: allow users to deposit some money, queue into a match, get some money back, all while being quick and smooth.

USDC on Solana was my chain of choice for this. I was already familiar with Solana (ty pump.fun), and using USDC means the numbers can look pretty (idk how else I would've converted SOL -> USD without burning api keys). 

All the work is basically handled with third party tools:

- __Privy:__ Account creation, embedded wallets to each user so they can just deposit money into that wallet
- __Helius:__ Interacting with the chain, getting wallet amounts, price conversions, payouts, withdrawls, etc.

The server side payout system was basically just
```ts
  await ledger.credit(userId, depositAmount, "deposit")
  await ledger.reserve(userId, stakeAmount, "match_stake")
  await ledger.payout(userId, winnings, "match_result")
  await treasury.withdraw(userId, withdrawAmount, destinationWallet)
```
_Yayy I don't have to touch the chain!_


I really wanna express my gratitude to the team behind Privy and Helius, this project would not have been possible without their engineering. TYSM

## Distribution
At first I was doing research, and I found similar games all had discord servers, giveaways, clipping programs, etc. 

At this point, I didn't wanna do allat. 

I made an X account @playjello and that was it. Posted a launch video, and we got a couple players but nothing huge. 

Fast forward a month, strangers on X were telling me to launch a coin, So I launched $PLAYJELLO on Bags. I had NO clue what I was doing btw. 

Then hundreds of people/bots were buying the coin within minutes and I was on calls with random chinese people in Beijing tryna learn how to "launch on dex" or "make an X comm". 

![x1](/X1.png)
At this point there were like a hundred players consecutively on the game and my infra was really getting tested. 

I spent $200 to launch the coin on Dex screener, then since I had no clue what I was doing, all the momentum died off within an hour.

![x2](/X2.png)


People were really nice and genuinely trying to help me out, and I feel bad that I couldn't perform when it mattered. I did make like $1k off fees though, so that's nice. 


## Lessons learned

I was really overthinking the legality aspect of it. In reality it's not that deep unless I made like a million dollars or something. 

At first I thought the most fun part of the project would be distribution, but the engineering ended up being the most fun part. Learning about websockets, security, and web3 architecture was really thrilling.

Also the crypto community is scary AF.
Anyways the game is still up (kinda dead tho) -> [jello.gg](https://jello.gg)

Shoutout to [Kevin Wang](https://x.com/k3vinwvng) for building this w/ me!
