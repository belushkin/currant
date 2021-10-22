import k from "./../../kaboom";

export default function getHealthbar(player) {
  const bar = add([
		rect(width(), 24),
		pos(0, 0),
		color(127, 255, 127),
    layer("ui"),
		fixed(),
		{
			max: player.max,
			set(hp) {
				this.width = width() * hp / this.max;
				this.flash = true;
			},
		},
	]);

  bar.action(() => {
		if (bar.flash) {
			bar.color = rgb(255, 255, 255);
			bar.flash = false;
		} else {
			bar.color = rgb(127, 255, 127);
		}
	});

  player.on("hurt", () => {
		bar.set(player.hp());
	});
}



  