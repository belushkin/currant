export default class EnemySpawnCmd {
  posX: number;
  posY: number;
  targetUuid: string;

  constructor(posX: number, posY: number, target: string) {
    this.posX = posX;
    this.posY = posY;
    this.targetUuid = target;
  }

  static fromPayload(payload: any) {
    return new this(payload.posX, payload.posY, payload.targetUuid);
  }
}
