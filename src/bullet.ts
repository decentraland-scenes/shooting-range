import utils from "../node_modules/decentraland-ecs-utils/index"

export class BulletMark extends Entity {
  constructor(model: GLTFShape, time?: number) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(new Transform())
    this.getComponent(Transform).rotate(Vector3.Forward(), Math.random() * 360) // Randomly rotate each bullet mark
    this.addComponent(new utils.ExpireIn(time * 1000)) // Disappears after 8 seconds
  }
}