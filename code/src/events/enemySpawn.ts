import {Vec2} from "kaboom";
import PlayerModel from "../playerModel";

export default class EnemySpawn {
  pos: Vec2
  target: PlayerModel;

  constructor(pos: Vec2, target: PlayerModel) {
    this.pos = pos;
    this.target = target;
  }
}
