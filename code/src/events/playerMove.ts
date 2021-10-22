import PlayerModel from "../playerModel";

export default class PlayerMove {

  player: PlayerModel;

  angle: number;
  speed: number;

  constructor(player: PlayerModel, angle: number, speed: number) {
    this.player = player;
    this.angle = angle;
    this.speed = speed;
  }
}
