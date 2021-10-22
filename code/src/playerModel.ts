import {Character, EventCanceller, Vec2} from "kaboom";
import shot from "./shot";
import emitter from "./emitter";
import PlayerScoreUpdated from "./events/playerScoreUpdated";

export default class PlayerModel {
  private move: Vec2;
  private pos: Vec2;
  private gameObject: Character;
  public readonly speed = 480;
  public readonly name: string;

  private score: number;

  private moveCanceler: EventCanceller;

  constructor(name: string, x: number, y: number, player: Character) {
    this.move = vec2(0,0);
    this.pos = vec2(x, y);
    this.gameObject = player;
    this.setPosition(x, y);
    this.setMove(0, 0);
    this.score = 0;
    this.name = name;
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

  public getMove(): Vec2
  {
    return this.move;
  }

  public stop(): void
  {
    this.setMove(this.move.x, 0);
  }

  public shot(angle: number): void
  {
    shot(this.getPos(), angle)
  }

  public getPos(): Vec2
  {
    return this.gameObject.pos;
  }

  public getPlayerObject(): Character
  {
    return this.gameObject;
  }

  public setScore(newScore: number): void
  {
    this.score = newScore;
    this.emitScore();
  }

  private emitScore() {
    emitter.emit('player.score.updated', new PlayerScoreUpdated(this, this.score));
  }

  public incScore(): void
  {
    this.score++;
    this.emitScore();
  }

  public getScore(): number
  {
    return this.score;
  }
}

