import k from "./../../kaboom";

// custom component
export default function insane() {
  let timer = 0;
  let isInsane = false;

  return {
    // component id / name
    id: "insane",
    // it requires the scale component
    // require: ["scale"],
    // this runs every frame
    update() {
      if (isInsane) {
      	timer -= dt();
      	if (timer <= 0) {
      		this.calm();
      	}
      }
    },
    // custom methods
    isInsane() {
      return isInsane;
    },
    calm() {
      timer = 0;
      isInsane = false;
    },
    insanity(time) {
      timer = time;
      isInsane = true;
    },
  };
}
