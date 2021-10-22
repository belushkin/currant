import Food from "./Food"
import SpawnerAbstract from "./spawnerAbstract";

export default class FoodSpawner extends SpawnerAbstract<Food> {

  protected spawn(): Food {
    const posX = this.getRandomInt(0, this.width);
    const posY = this.getRandomInt(0, this.height)
    return new Food(posX, posY);
  }

  public start(cb: (item: Food) => void): void
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

