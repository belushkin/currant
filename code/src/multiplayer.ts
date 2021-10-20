import Chance from "chance"
import PlayerModel from "./playerModel"

export default class Multiplayer {
  ws: WebSocket
  
  // Our uuid
  uuid: string

  players: Map<string, PlayerModel>

  name: string

  constructor() {
    const protocol = location.protocol === "https:" ? "wss" : "ws"
    const url = `${protocol}://${location.host}/multiplayer`;
    const chance = new Chance();
    this.name = chance.name();
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

  cmd(name, payload) {
    payload.commandName = name;
    this.ws.send(JSON.stringify(payload))
  }
}

