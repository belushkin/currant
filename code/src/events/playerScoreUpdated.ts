import PlayerModel from "../playerModel";

export default class PlayerScoreUpdated {
  public readonly player: PlayerModel;
  public readonly score: number;

  constructor(player: PlayerModel, score: number) {
    this.player = player;
    this.score = score;
  }
}
