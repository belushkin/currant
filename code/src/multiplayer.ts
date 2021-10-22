import PlayerModel from "./playerModel"
import JoinCmd from "./dto/joinCmd"
import emitter from "./emitter";
import PlayerJoined from "./events/playerJoined"
import PlayerMove from "./events/playerMove";
import MoveCmd from "./dto/moveCmd";

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
  }

  onMessage(event) {
    const payload = JSON.parse(event.data)
    console.log('RCV', payload);
    switch (payload.commandName) {
      case 'connected':
        this.handleConnected(payload);
        break;
      case 'player.join':
        this.handleJoin(payload);
        break;
      case 'player.move':
        this.hanleMove(payload);
        break;
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

  public addPlayer(uuid: string, pm: PlayerModel): void
  {
    this.players.set(uuid, pm);
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

