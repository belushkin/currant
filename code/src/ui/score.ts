import k from "../../kaboom"
import emitter from "../emitter"
import PlayerScoreUpdated from "../events/playerScoreUpdated";

export default function showScoreLabel(initScore: number): Function {
  const scoreLabel = k.add([
    text(initScore.toString()),
      pos(12, 82),
      fixed(),
      z(100),
      layer("ui"),
  ]);

  emitter.on("player.score.updated", (event: PlayerScoreUpdated) => {
    scoreLabel.text = event.score.toString();
  });

  return (score: number) => {
    scoreLabel.text = score.toString();
  }
}
