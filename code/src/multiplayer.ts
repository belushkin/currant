import PlayerModel from "./playerModel"
import JoinCmd from "./dto/joinCmd"
import emitter from "./emitter";
import GameEnd from "./events/gameEnd";
import PlayerJoined from "./events/playerJoined"
import PlayerMove from "./events/playerMove";
import MoveCmd from "./dto/moveCmd";
import EnemySpawnCmd from "./dto/enemySpawnCmd";
import EnemySpawn from "./events/enemySpawn";
import FoodSpawned from "./events/foodSpawned";
import CoinSpawned from "./events/coinSpawned";
import HeartSpawned from "./events/heartSpawned";
import k from "../kaboom";
import {Vec2} from "kaboom";

export default class Multiplayer {
  ws: WebSocket
  
  // Our uuid
  uuid: string
  private myslef: PlayerModel;

  private players: Map<string, PlayerModel> = new Map();

  name: string

  constructor(myslef: PlayerModel) {
    const protocol = location.protocol === "https:" ? "wss" : "ws"
    const url = `${protocol}://${location.host}/multiplayer`;
    this.myslef = myslef;
    this.name = myslef.name;
    console.log("My name is", this.name);
    console.log("Connecting to ws" , url);
    this.ws = new WebSocket(url)
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    emitter.on('player.move', this.onPlayerMove.bind(this))
    this.setupSelfListeners();
  }

  private setupSelfListeners() {
    const p = this.myslef.getPlayerObject();
    p.collides("coin", (item) => {
      const uuid = Object.keys(item.inspect()).pop();
      this.cmd('coin.taken', {
        uuid: uuid,
      })
    })
    p.collides("food", (item) => {
      const uuid = Object.keys(item.inspect()).pop();
      this.cmd('food.eaten', {
        uuid: uuid,
      });
    });
    p.collides("heart", (item) => {
      const uuid = Object.keys(item.inspect()).pop();
      this.cmd('heart.taken', {
        uuid: uuid,
      });
    });
    emitter.on('game.end',(event: GameEnd) => {
      this.cmd('game.end', {score: event.score})
      this.ws.close();
    })

    emitter.on('player.shot', (event) => {
      if (event.playerModel == this.myslef) {
        this.cmd('player.shot', {
          posX: event.pos.x,
          posY: event.pos.y,
          speed: event.speed,
          angle: event.angle,
        });

      }
    });

  }

  onMessage(event) {
    const payload = JSON.parse(event.data)
    console.log('RCV', payload);
    switch (payload.commandName) {
      case 'connected':
        this.handleConnected(payload);
        break;
      case 'disconnect':
        this.handleDisconnect(payload);
        break
      case 'player.join':
        this.handleJoin(payload);
        break;
      case 'player.move':
        this.hanleMove(payload);
        break;
      case 'enemy.spawn':
        this.handleEnemySpawn(payload);
        break;
      case 'enemy.killed':
        this.handleEnemyKilled(payload);
        break;
      case 'food.spawn':
        this.handleFoodSpawn(payload);
        break;
      case 'coin.spawn':
        this.handleCoinSpawn(payload);
        break;
      case 'name':
      case 'coin.taken':
      case 'food.eaten':
      case 'heart.taken':
        // nothing to do on client
        break;
      case 'heart.spawn':
        this.handleHeartSpawn(payload);
        break;

      case 'player.shot':
        this.handlePlayerShot(payload);
        break;
      case 'game.end': this.handleGameEnd(payload); break;
      default:
        console.log('Unsupported command', payload.commandName);
    }
  }

  private handleDisconnect(payload): void
  {
    const user = payload.user;
    const pm = this.players.get(user);
    pm.disconnect();
    this.players.delete(user);
  }

  private handleGameEnd(payload): void
  {
  }

  private handlePlayerShot(payload): void
  {
    const pm = this.players.get(payload.user);
    if (pm) {
      pm.shot(payload.angle, payload.speed);
    }
    
  }

  private handleConnected(cmd): void
  {
    this.uuid = cmd.user;
    this.setName(this.name);
    this.join();
  }

  onOpen(event) {
  }

  join(): void {
    const cmd = new JoinCmd(
      this.myslef.getPos().x,
      this.myslef.getPos().y,
      this.myslef.getMove().y,
      this.myslef.getMove().x,

    );
    this.cmd('player.join', cmd);
  }

  private hanleMove(payload: any): void
  {
    const cmd = MoveCmd.fromPayload(payload);
    const user = payload.user;
    const pm = this.players.get(user);
    if (pm instanceof PlayerModel) {
      pm.setPosition(cmd.posX, cmd.posY);
      pm.setMove(cmd.angle, cmd.speed);
    } else {
      console.error("No player " + user, pm);
    }
  }

  private handleCoinSpawn(payload): void
  {
    const event = new CoinSpawned(vec2(payload.posX, payload.posY), payload.uuid);
    emitter.emit('coin.spawned', event);
  }

  private handleCoinTaken(payload): void
  {
//    k.destroy(payload.uuid);
  }

  private handleHeartSpawn(payload): void
  {
    const event = new HeartSpawned(vec2(payload.posX, payload.posY), payload.uuid);
    emitter.emit('heart.spawned', event);
  }
  private handleEnemySpawn(payload: any): void
  {
    const cmd = EnemySpawnCmd.fromPayload(payload);

    let player;
    if (cmd.targetUuid == this.uuid) {
      player = this.myslef;
    } else {
      player = this.players.get(cmd.targetUuid);
    }

    if (player) {
      const event = new EnemySpawn(vec2(cmd.posX, cmd.posY), player, payload.uuid);
      emitter.emit('enemy.spawn', event);
    } else {
      console.log('Cannot spawn enemy, no player found', cmd.targetUuid);
    }
  }

  private handleFoodSpawn(payload): void
  {
    const event = new FoodSpawned(vec2(payload.posX, payload.posY), payload.uuid);
    emitter.emit('food.spawned', event);
  }

  public addPlayer(uuid: string, pm: PlayerModel): void
  {
    this.players.set(uuid, pm);
  }

  private handleEnemyKilled(payload) :void
  {
    k.destroyAll(payload.uuid);
  }

  handleJoin(payload: any): void
  {
    const cmd = JoinCmd.fromPayload(payload);
    const uuid = payload.user;
    const name = payload ?? ''
    emitter.emit('player.joined', new PlayerJoined(cmd, uuid, name));
  }

  setName(name: string) {
    const cmd = {
      name: name
    }
    this.cmd('name', cmd);
  }

  sendPlayerStop() {
    this.cmd('player.stop', {
      'position': this.myslef.getPos(),
    });
  }

  private cmd(name: string, payload: Object) {
    payload.commandName = name;
    this.ws.send(JSON.stringify(payload))
  }

  private onPlayerMove(pm: PlayerMove): void {
    if (this.ws.readyState != this.ws.OPEN) { return }
    if (pm.player == this.myslef) {
      const cmd = new MoveCmd(
        pm.player.getPos().x,
        pm.player.getPos().y,
        pm.angle,
        pm.speed
      );
      this.cmd('player.move', cmd)
    }
  }
}

