import k from "../../kaboom"

export default function timer() {
  const timer = add([
		text(0),
		pos(12, 12),
		fixed(),
		layer("ui"),
		{ time: 0, },
	]);

  timer.action(() => {
		timer.time += dt();
		timer.text = timer.time.toFixed(2);
	});
}
