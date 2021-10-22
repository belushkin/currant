import k from "./../kaboom";

export default function getHealthbar(healthnumber) {
  const bar = add([
		rect(100, 24),
		pos(0, 0),
		color(127, 255, 127),
    layer("ui"),
		fixed(),
		{
			max: 100,
			set(hp) {
        console.log('kuma');
				this.width = 2;
				this.flash = true;
			},
		},
	]);

  bar.action(() => {
    console.log('analgin');
		if (bar.flash) {
      console.log('pisildur');
			bar.color = rgb(255, 255, 255);
			bar.flash = false;
		} else {
			bar.color = rgb(127, 255, 127);
		}
	});
  return bar;
}



  