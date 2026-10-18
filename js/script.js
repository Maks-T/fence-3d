let renderer, camera, scene, light, controls;


class Beam {
  constructor(lineColor, textureName, w, h, l, scene, offset = 0, direction = 'v', name = 'name') {
    this.offset = offset;
    this.direction = direction === 'h' ? 'y' : 'x';
    this.name = name;
    this.scene = scene;
    this.width = w;
    this.heigth = h;
    this.length = l;
    this.materialBaluster = new THREE.MeshPhongMaterial();

    let texture = THREE.ImageUtils.loadTexture(`/fence-3d/textures/${textureName}.jpg`), t1, t2;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    w > l ? (() => {t1 = w / 200; t2 = h / 200;})() : (() => {texture.center.set(.5, .5); texture.rotation = THREE.Math.degToRad(90); t1 = l / 200; t2 = h / 200;})();
    texture.repeat.set(t1, t2);
    this.materialBaluster.map = texture;
    this.materialEdge = new THREE.LineBasicMaterial({color: lineColor});
    this.materialEdge.colorWrite = !!lineColor;
  }

  initModel() {
    const geometryBeam = new THREE.BoxBufferGeometry( this.width, this.length, this.heigth),
          geometryEdge = new THREE.EdgesGeometry(geometryBeam);
    this.beam = new THREE.Mesh( geometryBeam, this.materialBaluster);
    this.edge = new THREE.LineSegments(geometryEdge, this.materialEdge);

    this.beam.position.y -= this.offset;
    this.edge.position.y -= this.offset;
  }

  draw(count = 0, step = 0) {
    //начало
    const start = -((this.heigth + step) * (count - 1)) / 2;
    this.beam.position[this.direction] += start;
    this.edge.position[this.direction] += start;

    step += this.heigth;
    for (let i = 0; i < count; i++) {
      const clonedBeam = this.beam.clone(),
        clonedEdge = this.edge.clone();

      clonedBeam.name = `baluster: ${this.name}${i}`;
      clonedEdge.name = `edge: ${this.name}${i}`;

      this.scene.add(clonedBeam, clonedEdge);
      this.beam.position[this.direction] += step;
      this.edge.position[this.direction] += step;
    }
  }
}

function initRender() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(650, 650);
  renderer.setClearColor(0xeeeeee);
  document.querySelector('#content').append(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, 1, 0.2, 10000);
  camera.position.set(400, 500, 3000);
}

function changeBackground(name) {
  if (name === 'no') {
    scene.background = 'none';
  }
  else {
    // Добавляем в сцену текстуру бокса
    let cubeTextureLoader = new THREE.CubeTextureLoader();

    cubeTextureLoader.setPath( `/fence-3d/textures/cube/${name}/` );
    scene.background = cubeTextureLoader.load( [
      'px.jpg', 'nx.jpg',
      'py.jpg', 'ny.jpg',
      'pz.jpg', 'nz.jpg'
    ] );
  }
}

function initScene() {
  scene = new THREE.Scene();
}

function initLight() {
  scene.add(new THREE.AmbientLight(0xFFFAFA));
}

function removeAllMesh() {
  Object.values(scene.children).forEach(e => {
    const type = e.type.toLowerCase();
    if (type === 'mesh' || type === 'linesegments') scene.remove(e);
  });
}

function initModel(e) {
  if (e && e.target.id === 'bg') return;
  const param = document.querySelector('#data');
  let form = new FormData(param), data = {};

  for (let i of form) {
    data[i[0]] = i[1].includes('*') ? i[1].split('*') : i[1];    //собираем данные из формы
  }

  removeAllMesh();
  //вертикальные балясины
  const balusterVertical = new Beam(data['lineColor'], data['texture'], +data['baluster'][1], +data['baluster'][0], +data['height'] - +data['top'] - +data['bottom'] - +data['baluster'][0] * 2, scene);
  balusterVertical.initModel();
  balusterVertical.draw(+data['count'], (+data['width'] - +data['pillar'] * 2 - +data['count'] * +data['baluster'][0]) / (+data['count'] + 1));
  //горизонтальные балясины
  const balusterHorizontal = new Beam(data['lineColor'], data['texture'], +data['width'] - +data['pillar'] * 2, +data['baluster'][0], +data['baluster'][1], scene, 0, 'h');
  balusterHorizontal.initModel();
  balusterHorizontal.draw(2,+data['height'] - +data['top'] - +data['bottom'] - +data['baluster'][0] * 2);
  //столбы
  const pillar = new Beam(data['lineColor'], data['texture'], +data['pillar'], +data['pillar'], +data['height'], scene, (+data['bottom'] - +data['top']) / 2);
  pillar.initModel();
  pillar.draw(2,+data['width'] - +data['pillar'] * 2);
}

function initControls() {

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  // Когда анимация используется в цикле, демпфирование или вращение означает наличие инерции
  controls.enableDamping = true;
  // Коэффициент динамического демпфирования - это чувствительность вращения мыши при перетаскивании
  controls.dampingFactor = 0.25;
  // Можно увеличить
  controls.enableZoom = true;
  // Следует ли автоматически вращать
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;
  // Устанавливаем максимальное расстояние камеры от начала координат
  controls.minDistance = 1;
  // Устанавливаем максимальное расстояние камеры от начала координат
  controls.maxDistance = 5000;
  // Следует ли разрешить перетаскивание правой кнопкой мыши
  controls.enablePan = true;
}

function initEvents() {
  document.querySelector('#options').addEventListener('change', (e) => initModel(e));
  document.querySelector('#bg').addEventListener('change', (e) => changeBackground(e.target.value));
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function draw() {
  initEvents();
  initRender();
  initScene();
  initCamera();
  initLight();
  initModel();
  initControls();

  animate();
}

draw();