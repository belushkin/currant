import k from "./../kaboom";

loadSprite("googoly", "sprites/googoly.png");

export default function spawnEnemy() {
  k.add([
    sprite("googoly"),
    pos(rand(width()), rand(height())),
    area(),
    // moveTo(player.pos, 80),
    origin("top"),
    'enemy'
  ]);
  wait(rand(0.5, 1.5), spawnEnemy());
  // enemy.action(() => {
	//   enemy.moveTo(player.pos, 80);
  // });
}
