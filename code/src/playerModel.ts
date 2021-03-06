import { Character, EventCanceller, Vec2 } from "kaboom";
import shot from "./shot";
import emitter from "./emitter";
import PlayerScoreUpdated from "./events/playerScoreUpdated";
import PlayerMove from "./events/playerMove";

export default class PlayerModel {
  private move: Vec2;
  private pos: Vec2;
  private gameObject: Character;
  public readonly speed = 480;
  public readonly name: string;
  public readonly own: boolean;

  private score: number;

  private moveCanceler: EventCanceller;

  constructor(name: string, x: number, y: number, player: Character, own: boolean) {
    this.move = vec2(0, 0);
    this.pos = vec2(x, y);
    this.gameObject = player;
    this.setPosition(x, y);
    this.setMove(0, 0);
    this.score = 0;
    this.name = name;
    this.own = own;
  }

  public setPosition(x: number, y: number): void {
    this.pos.x = x;
    this.pos.y = y;
    this.gameObject.moveTo(this.pos.x, this.pos.y);
  }

  public setMove(angle: number, speed: number = 480): void {
  

    if (this.move.x == angle && this.move.y == speed) {
      return;
    }

    if (this.moveCanceler != undefined) {
      this.moveCanceler();
    }

    this.move.x = angle;
    this.move.y = speed;
    this.moveCanceler = this.gameObject.action(() => {
      this.gameObject.move(dir(angle).scale(speed));
    });

    emitter.emit('player.move', new PlayerMove(this, angle, speed));
  }

  public getMove(): Vec2
  {
    return this.move;
  }

  public stop(): void {
    this.setMove(this.move.x, 0);
  }

  public shot(angle: number, speed: number): void {
    shot(this.getPos(), angle, speed);
    emitter.emit('player.shot', { pos: this.getPos(), angle, speed, playerModel: this })
  }

  public getPos(): Vec2 {
    return this.gameObject.pos;
  }

  public getPlayerObject(): Character {
    return this.gameObject;
  }

  public setScore(newScore: number): void {
    this.score = newScore;
    this.emitScore();
  }

  private emitScore() {
    emitter.emit(
      "player.score.updated",
      new PlayerScoreUpdated(this, this.score)
    );
  }

  public incScore(): void {
    this.score++;
    this.emitScore();
  }

  public getScore(): number {
    return this.score;
  }

  public disconnect(): void {
    this.gameObject.destroy();
  }
}
