import Player from "./player"

export default abstract class SpawnerAbstract<Item> {
  players: Map<string, Player>;
  width: number;
  height: number;

  constructor(players: Map<string, Player>, width: number, height: number) {
    this.players = players
    this.width = width
    this.height = height
  }

  protected abstract spawn(): Item;
  protected abstract getInterval(): number;

  public start(cb: (enemy: Item) => void): void
  {
    if (this.players.size > 0) {
      cb(this.spawn());
    }
    const interval = this.getInterval();
    setTimeout(() => {this.start(cb)}, interval);
  }

  protected getRandomKey() {
    let keys = Array.from(this.players.keys());
    return keys[Math.floor(Math.random() * keys.length)];
  }

  protected getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
  }
}
