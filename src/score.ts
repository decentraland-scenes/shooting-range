@Component("scoreFlag")
export class ScoreFlag {}

export class Score extends Entity {
  constructor(model: GLTFShape, transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)
    this.addComponent(new ScoreFlag())
    this.addComponent(new Animator())
    this.getComponent(Animator).addClip(new AnimationState("Pop", { looping: false }))
  }

  // Play the score's pop up animation
  public playAnimation(): void {
    this.getComponent(Transform).lookAt(Camera.instance.position)
    this.getComponent(Animator).getClip("Pop").stop() // Bug workaround
    this.getComponent(Animator).getClip("Pop").play()
  }
}

// Score faces the user to help with readability
class ScoreTrackUserSystem {
  scoreGroup = engine.getComponentGroup(ScoreFlag)
  update() {
    for (let entity of this.scoreGroup.entities) {
      let entityTransform = entity.getComponent(Transform)
      entityTransform.lookAt(Camera.instance.position)
    }
  }
}

engine.addSystem(new ScoreTrackUserSystem())
