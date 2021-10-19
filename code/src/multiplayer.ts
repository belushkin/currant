import Chance from "chance"

export default class Multiplayer {
  ws: WebSocket

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
    
    
  }

  onOpen(event) {
    this.join(this.name)  
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

