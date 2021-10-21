import k from "./kaboom";
import spawnFood from "./src/food";
import getPlayer from "./src/player";
import getEnemy from "./src/enemy";

// import { setMoveAction } from "./src/move";
import { setMoveAction } from "./src/moveModel";

import Multiplayer from "./src/multiplayer"
import PlayerModel from "./src/playerModel";

const mp = new Multiplayer()

const BULLET_SPEED = 1200;
const JULEP_SPEED = 48;
const JULEP_HEALTH = 1000;
const OBJ_HEALTH = 4;

let insaneMode = false;

function addButton(txt, p, f) {
    const btn = add([
      text(txt, 8),
      pos(p),
      area({ cursor: "pointer", }),
      scale(1),
      origin("center"),
    ]);

    btn.clicks(f);
    btn.hovers(() => {
      const t = time() * 10;
      btn.color = rgb(
        wave(0, 255, t),
        wave(0, 255, t + 2),
        wave(0, 255, t + 4),
      );
      btn.scale = vec2(1.2);
    }, () => {
      btn.scale = vec2(1);
      btn.color = rgb();
    });
  }

k.scene("end", () => {
  add([
      text("Game over!", { size: 26 }),
      pos(width() / 2, height() / 2),
      origin("center"),
      fixed(),
  ]);
  addButton("Start", vec2(width() / 2, (height() / 2) + 26) , () => go("battle"));
});


k.scene("start", () => {

add([
		text("Play the game", { size: 26 }),
		pos(width() / 2, height() / 2),
		origin("center"),
		fixed(),
	]);
  addButton("Start", vec2(width() / 2, (height() / 2) + 76), () => go("battle"));
  addButton("Quit", vec2(width() / 2, (height() / 2) + 146), () => go("end"));
});

k.scene("battle", () => {

  layers([
		"game",
		"ui",
	], "game");

  function late(t) {
		let timer = 0;
		return {
			add() {
				this.hidden = true;
			},
			update() {
				timer += dt();
				if (timer >= t) {
					this.hidden = false;
				}
			},
		};
	}

  function addExplode(p, n, rad, size) {
		for (let i = 0; i < n; i++) {
			wait(rand(n * 0.1), () => {
				for (let i = 0; i < 2; i++) {
					add([
						pos(p.add(rand(vec2(-rad), vec2(rad)))),
						rect(4, 4),
						outline(4),
						scale(1 * size, 1 * size),
						lifespan(0.1),
						grow(rand(48, 72) * size),
						origin("center"),
            fixed()
					]);
				}
			});
		}
	}

  function grow(rate) {
		return {
			update() {
				const n = rate * dt();
				this.scale.x += n;
				this.scale.y += n;
			},
		};
	}

  function spawnBullet(p) {
		add([
			rect(12, 48),
			area(),
			pos(p),
			origin("center"),
			color(127, 127, 255),
			outline(4),
			move(UP, BULLET_SPEED),
			cleanup(),
			// strings here means a tag
			"bullet",
		]);
	}

  function spawnBullet(p) {
		add([
			rect(12, 48),
			area(),
			pos(p),
			origin("center"),
			color(127, 127, 255),
			outline(4),
			move(enemy.pos, BULLET_SPEED),
			cleanup(),
			// strings here means a tag
			"bullet",
		]);
	}

  add([
		text("KILL", { size: 160 }),
		pos(width() / 2, height() / 2),
		origin("center"),
		lifespan(1),
		fixed(),
		layer("ui"),
	]);

	add([
		text("THE", { size: 80 }),
		pos(width() / 2, height() / 2),
		origin("center"),
		lifespan(2),
		late(1),
		fixed(),
		layer("ui"),
	]);

	add([
		text('JULEP', { size: 120 }),
		pos(width() / 2, height() / 2),
		origin("center"),
		lifespan(4),
		late(2),
		fixed(),
		layer("ui"),
	]);

  let score = 0;
  const scoreLabel = add([
      text(score, 2),
      pos(12, 12),
      fixed(),
      z(100),
      layer("ui"),
  ]);
  
  // Init enemy
  const enemy = getEnemy("julep");
  
  enemy.action(() => {
	  enemy.moveTo(player.pos, 80);
  });

  const playerNameHud = add([
    text(mp.name, {
      size: 24
    }),
    pos(12, height() - 36),
    fixed(),
    z(100),
  ]);

  // Init player
  const player = getPlayer("currant");
  const playedModel = new PlayerModel(80, 40, player);
  window.p1 = playedModel;

  // start spawning foods
  spawnFood();

  // move
  setMoveAction(playedModel);

  keyPress("space", () => {
		spawnBullet(player.pos.sub(16, 0));
		spawnBullet(player.pos.add(16, 0));
		// play("shoot", {
		// 	volume: 0.3,
		// 	detune: rand(-1200, 1200),
		// });
	});

  keyPress("q", () => {
    go("end");
  });
    
  player.collides("food", (food) => {
    destroy(food);
    score += 1;
    scoreLabel.text = score;
    addKaboom(player.pos);
    player.biggify(0.5);
  });

  player.collides("julep", (e) => {
		destroy(e);
		destroy(player);
		shake(120);
		// play("explode");
		// music.detune(-1200);
		addExplode(center(), 12, 120, 30);
		wait(1, () => {
			// music.stop();
			go("battle");
		});
	});


});

go("start");
