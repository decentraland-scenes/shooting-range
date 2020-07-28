import { Target } from "./target"
import { BulletMark } from "./bullet"
import utils from "../node_modules/decentraland-ecs-utils/index"

// Base scene
const base = new Entity()
base.addComponent(new GLTFShape("models/baseLight.glb"))
base.addComponent(new Transform())
engine.addEntity(base)

// Shooting area
const redMaterial = new Material()
redMaterial.albedoColor = Color3.Red()

const shootingArea = new Entity()
shootingArea.addComponent(new BoxShape())
shootingArea.addComponent(
  new Transform({
    position: new Vector3(8, 0.075, 2),
    scale: new Vector3(16, 0.05, 4),
  })
)
shootingArea.addComponent(redMaterial)
engine.addEntity(shootingArea)

// Create trigger for shooting area
let triggerBox = new utils.TriggerBoxShape(new Vector3(16, 16, 4), Vector3.Zero())

shootingArea.addComponent(
  new utils.TriggerComponent(
    triggerBox, 0, 0, null, null, 
    () => { // Player enter
      isPlayerInShootingArea = true
      shootingArea.getComponent(Material).emissiveColor = Color3.Yellow()
    },
    () => { // Player exit
      isPlayerInShootingArea = false
      shootingArea.getComponent(Material).emissiveColor = Color3.Black()
    }
  )
)

// Cache bullet mark on load otherwise the first bullet mark won't appear instantly when fired
const bulletMarkShape = new GLTFShape("models/bulletMark.glb")
const bulletMarkCache = new BulletMark(bulletMarkShape)
bulletMarkCache.getComponent(Transform).scale.setAll(0)

// Setup targets
const targetShape = new GLTFShape("models/target.glb")
const NUM_OF_TARGETS = 3
let time = 7
let posZ = 7

for (let i = 0; i < NUM_OF_TARGETS; i++) {
  // Define two positions for toggling
  let startPosX = new Vector3(1, 1.5, posZ)
  let endPosX = new Vector3(14, 1.5, posZ)
  if (i % 2 == 0) {
    const target = new Target(targetShape, startPosX, endPosX, time)
  } else {
    const target = new Target(targetShape, endPosX, startPosX, time)
  }
  time -= 0.33
  posZ += 3
}

// Sounds
const gunShot = new Entity()
gunShot.addComponent(new AudioSource(new AudioClip("sounds/shot.mp3")))
gunShot.addComponent(new Transform())
gunShot.getComponent(Transform).position = Camera.instance.position
engine.addEntity(gunShot)

const gunShotFail = new Entity()
gunShotFail.addComponent(new AudioSource(new AudioClip("sounds/shotFail.mp3")))
gunShotFail.addComponent(new Transform())
gunShotFail.getComponent(Transform).position = Camera.instance.position
engine.addEntity(gunShotFail)

// Controls
const input = Input.instance
const DELETE_TIME = 8 // In seconds
let isPlayerInShootingArea = false

input.subscribe("BUTTON_DOWN", ActionButton.POINTER, true, (e) => {
  if (isPlayerInShootingArea) {
    gunShot.getComponent(AudioSource).playOnce()
    if (engine.entities[e.hit.entityId] != undefined) {
      // Calculate the position of where the bullet hits relative to the target
      let relativePosition = e.hit.hitPoint.subtract(engine.entities[e.hit.entityId].getComponent(Transform).position)
      const bulletMark = new BulletMark(bulletMarkShape, DELETE_TIME)
      bulletMark.setParent(engine.entities[e.hit.entityId]) // Make the bullet mark the child of the target so that it remains on the target
      bulletMark.getComponent(Transform).position = relativePosition
    }
  } else {
    gunShotFail.getComponent(AudioSource).playOnce()
  }
})
