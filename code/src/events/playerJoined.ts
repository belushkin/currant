import JoinCmd from "../dto/joinCmd";

export default class PlayerJoined {
  data: JoinCmd;
  uuid: string;
  name: string;

  constructor(cmd: JoinCmd, uuid: string, name: string) {
    this.data = cmd;
    this.uuid = uuid;
    this.name = name;
  }

}
