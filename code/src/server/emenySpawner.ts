import Enemy from "./enemy";
import SpawnerAbstract from "./spawnerAbstract";

export default class EnemySpawner extends SpawnerAbstract<Enemy> {
  protected spawn(): Enemy {
    const posX = this.getRandomInt(0, this.width);
    const posY = this.getRandomInt(0, this.height)
    const enemy = new Enemy(posX, posY, this.players.get(this.getRandomKey()));

    return enemy;
  }

  public start(cb: (enemy: Enemy) => void): void
  {
    if (this.players.size > 0) {
      cb(this.spawn());
    }
    setTimeout(() => {this.start(cb)}, this.getInterval());
  }

  protected getInterval(): number
  {
    return this.getRandomInt(1000, 3000) ;
  }
}

