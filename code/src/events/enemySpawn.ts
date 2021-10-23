import {Vec2} from "kaboom";
import PlayerModel from "../playerModel";

export default class EnemySpawn {
  pos: Vec2
  target: PlayerModel;
  uuid: string;

  constructor(pos: Vec2, target: PlayerModel, uuid: string) {
    this.pos = pos;
    this.target = target;
    this.uuid = uuid;
  }
}
