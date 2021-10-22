import PlayerModel from "./playerModel"

export default class Multiplayer {
  ws: WebSocket
  
  // Our uuid
  uuid: string
  private myslef: PlayerModel;

  players: Map<string, PlayerModel>

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
  }

  onMessage(event) {
    const payload = JSON.parse(event.data)
    console.log('RCV', payload);
    switch (payload.commandName) {
      case 'connected':
        this.handleConnected(payload);
        break;
    }
  }

  private handleConnected(cmd): void
  {
    this.uuid = cmd.user;
    this.join(this.name)  
  }

  onOpen(event) {
  }

  join(name: string) {
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
}

