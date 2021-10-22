import Heart from "./heart"
import SpawnerAbstract from "./spawnerAbstract";

export default class HeartSpawner extends SpawnerAbstract<Heart> {

  protected spawn(): Heart {
    const posX = this.getRandomInt(0, this.width);
    const posY = this.getRandomInt(0, this.height)
    return new Heart(posX, posY);
  }

  public start(cb: (item: Heart) => void): void
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

