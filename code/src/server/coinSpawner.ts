import Coin from "./coin"
import SpawnerAbstract from "./spawnerAbstract";

export default class CoinSpawner extends SpawnerAbstract<Coin> {

  protected spawn(): Coin {
    const posX = this.getRandomInt(0, this.width);
    const posY = this.getRandomInt(0, this.height)
    return new Coin(posX, posY);
  }

  public start(cb: (item: Coin) => void): void
  {
    if (this.players.size > 0) {
      cb(this.spawn());
    }
    setTimeout(() => {this.start(cb)}, this.getInterval());
  }

  protected getInterval(): number
  {
    return this.getRandomInt(500, 1500);
  }
}

