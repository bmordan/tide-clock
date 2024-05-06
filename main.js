import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const ambientLight = new THREE.AmbientLight('AliceBlue', 1)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let tideLevel = 0

const tankGeometry = new THREE.BoxGeometry(5, 1.2, 2)
const waterGeometry = new THREE.BoxGeometry(5, tideLevel, 2)
const waterMaterial = new THREE.MeshBasicMaterial({ color: 'CornflowerBlue' })
const tankMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0.7,
  color: 'Aquamarine',
})
const tank = new THREE.Mesh(tankGeometry, tankMaterial)
const water = new THREE.Mesh(waterGeometry, waterMaterial)

scene.background = new THREE.Color('White')
scene.add(tank)
scene.add(water)
scene.add(ambientLight)

tank.position.set(0, 0, 0)
water.position.set(0, 0, 0)

camera.position.z = 5
camera.position.y = 2

function alignMeshes() {
  water.geometry.dispose()
  water.geometry = new THREE.BoxGeometry(5, tideLevel, 2)
  const bb1 = new THREE.Box3().setFromObject(tank)
  const bb2 = new THREE.Box3().setFromObject(water)
  const tankHeight = bb1.max.y - bb1.min.y
  const waterHeight = bb2.max.y - bb2.min.y
  water.position.y = (waterHeight - tankHeight) / 2
}

function updateTideLevel() {}

function animate() {
  requestAnimationFrame(animate)
  updateTideLevel()
  alignMeshes()
  renderer.render(scene, camera)
}

function changeTideInit() {
  const input = document.getElementById('tide-level-input')
  input.setAttribute('value', tideLevel)
  input.addEventListener('input', function (event) {
    tideLevel = Number(event.currentTarget.value)
  })
}

async function getTidalData() {
  const data = await fetch(
    `https://environment.data.gov.uk/flood-monitoring/id/measures/E71939-level-tidal_level-Mean-15_min-mAOD`,
  )
    .then(res => res.json())
    .catch(console.error)
  const { value, dateTime } = data.items.latestReading
  const timeElement = document.getElementById('reading')
  timeElement.innerText = new Date(dateTime).toLocaleString()
  tideLevel = value
}

animate()
changeTideInit()
getTidalData()
