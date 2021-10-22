import {Vec2} from "kaboom";

export default class CoinSpawned {
  pos: Vec2;
  uuid: string;

  constructor(pos: Vec2, uuid: string) {
    this.pos = pos;
    this.uuid = uuid;
  }
}
