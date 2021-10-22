import k from "../../kaboom"


function late(t: number) {
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

export default function showMission() {
  k.add([
    text("KILL", { size: 60 }),
    pos(width()-220, 40),
    // origin("topright"),
    lifespan(1),
    fixed(),
    layer("ui"),
  ]);

  k.add([
    text("THE", { size: 60 }),
    pos(width()-220, 40),
    lifespan(2),
    late(1),
    fixed(),
    layer("ui"),
  ]);

  k.add([
    text('JULEP', { size: 60 }),
    pos(width()-220, 40),
    lifespan(4),
    late(2),
    fixed(),
    layer("ui"),
  ]);
}
