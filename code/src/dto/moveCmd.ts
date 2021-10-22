export default class MoveCmd {
  posX: number;
  posY: number;
  speed: number;
  angle: number;

  constructor(posX: number, posY: number, angle: number, speed: number) {
    this.posX = posX;
    this.posY = posY;
    this.speed = speed;
    this.angle = angle;
  }

  static fromPayload(payload: any): MoveCmd
  {
    return new this(
      payload.posX,
      payload.posY,
      payload.angle,
      payload.speed,
    )
  }

}
