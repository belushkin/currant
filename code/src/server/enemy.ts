import Player from "./player";

export default class Enemy {
  posX: number;
  posY: number;

  target: Player

  constructor(posX:number, posY: number, target: Player) {
    this.posX = posX;
    this.posY = posY;
    this.target = target;
  }
}
