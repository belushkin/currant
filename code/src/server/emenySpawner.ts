import Enemy from "./enemy";
import Player from "./player"

export default class EnemySpawner {
  players: Map<string, Player>;
  width: number;
  height: number;

  constructor(players: Map<string, Player>, width: number, height: number) {
    this.players = players
    this.width = width
    this.height = height
  }

  private spawn(): Enemy {
    const posX = this.getRandomInt(0, this.width * 2);
    const posY = this.getRandomInt(0, this.height * 2)
    const enemy = new Enemy(posX, posY, this.players.get(this.getRandomKey()));

    return enemy;
  }

  public start(cb: (enemy: Enemy) => void): void
  {
    if (this.players.size > 0) {
      cb(this.spawn());
    }
    const interval = (Math.random() * (2) + 1) * 1000
    setTimeout(() => {this.start(cb)}, interval);
  }

  getRandomKey() {
    let keys = Array.from(this.players.keys());
    return keys[Math.floor(Math.random() * keys.length)];
  }

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
  }
}
