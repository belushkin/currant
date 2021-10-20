import {Character, EventCanceller, Vec2} from "kaboom";

export default class PlayerModel {
  private move: Vec2;
  private pos: Vec2;
  private gameObject: Character;
  public readonly speed = 480;

  private moveCanceler: EventCanceller;

  constructor(x: number, y: number, player: Character) {
    this.move = vec2(0,0);
    this.pos = vec2(x, y);
    this.gameObject = player;
    this.setPosition(x, y);
    this.setMove(0, 0);
  }

  public setPosition(x: number, y: number): void
  {
    this.pos.x = x;
    this.pos.y = y;
    this.gameObject.moveTo(this.pos.x, this.pos.y);
  }

  public setMove(angle: number, speed: number = 480): void
  {
    if (this.moveCanceler != undefined) { 
      this.moveCanceler();
    }
    this.move.x = angle;
    this.move.y = speed;
    this.moveCanceler = this.gameObject.action(() => {
      this.gameObject.move(dir(angle).scale(speed));
    });
  }

  public stop(): void
  {
    this.setMove(this.move.x, 0);
  }

  public getPos(): Vec2
  {
    return this.gameObject.pos;
  }
}

