import utils from "../node_modules/decentraland-ecs-utils/index"

export class Target extends Entity {
  constructor(model: GLTFShape, startPos: Vector3, endPos: Vector3, time: number) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(new Transform())

    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value) => {
        if (value == utils.ToggleState.On) {
          this.addComponentOrReplace(
            new utils.MoveTransformComponent(startPos, endPos, time, () => {
              this.getComponent(utils.ToggleComponent).toggle()
            })
          )
        } else {
          this.addComponentOrReplace(
            new utils.MoveTransformComponent(endPos, startPos, time, () => {
              this.getComponent(utils.ToggleComponent).toggle()
            })
          )
        }
      })
    )
    this.getComponent(utils.ToggleComponent).toggle()
  }
}
