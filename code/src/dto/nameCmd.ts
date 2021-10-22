export default class NameCmd {
  name: string

  constructor(name: string) {
    this.name = name;
  }

  static fromPayload(payload: any): NameCmd
  {
    return new this(
      payload.name
    )
  }
}
