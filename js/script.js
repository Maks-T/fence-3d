const API_BASE = 'https://oliverdeck.vistegra-admin.ru/api/v1';
const API_HEADERS = {
  'X-Sales-Channel': 'widget',
  'Accept-Language': 'ru',
  'Accept': 'application/json',
};

const BOTTOM_GAP = 50;
const TOP_GAP = 70;
const FRAME_H = 100;
const VERT_GAP = 100;
const FRAME_GAP = 250;
const HORIZ_GAP = 80;

const LIMITS = { width: [800, 3000], height: [600, 1500] };

const SHAPES = [
  { id: 'vertical-1', title: 'Вертикальные балясины 1' },
  { id: 'vertical-2', title: 'Вертикальные балясины 2' },
  { id: 'horizontal-1', title: 'Горизонтальные балясины 1' },
  { id: 'horizontal-2', title: 'Горизонтальные балясины 2' },
  { id: 'cross-1', title: 'Крестик 1' },
  { id: 'cross-2', title: 'Крестик 2' },
  { id: 'cross-3', title: 'Крестик 3' },
];

const ATLAS_PATH = './textures/wood_atlas.jpg';
const ATLAS_UV = {
  0:  { name: 'Honey Teak',           uv: [0.00, 0.00, 0.25, 0.25] },
  1:  { name: 'Dark Chocolate',       uv: [0.25, 0.00, 0.50, 0.25] },
  2:  { name: 'Light Oak',            uv: [0.50, 0.00, 0.75, 0.25] },
  3:  { name: 'Classic Teak',         uv: [0.75, 0.00, 1.00, 0.25] },

  4:  { name: 'Ash Gray',             uv: [0.00, 0.25, 0.25, 0.50] },
  5:  { name: 'Charcoal',             uv: [0.25, 0.25, 0.50, 0.50] },
  6:  { name: 'Silver Gray',          uv: [0.50, 0.25, 0.75, 0.50] },
  7:  { name: 'Graphite Velvet',      uv: [0.75, 0.25, 1.00, 0.50] },

  8:  { name: 'Mahogany',             uv: [0.00, 0.50, 0.25, 0.75] },
  9:  { name: 'Walnut',               uv: [0.25, 0.50, 0.50, 0.75] },
  10: { name: 'Cedar',                uv: [0.50, 0.50, 0.75, 0.75] },
  11: { name: 'Driftwood',            uv: [0.75, 0.50, 1.00, 0.75] },

  12: { name: 'Light Gray Matte',     uv: [0.00, 0.75, 0.25, 1.00] },
  13: { name: 'Brown Velvet',         uv: [0.25, 0.75, 0.50, 1.00] },
  14: { name: 'Quicksand',            uv: [0.50, 0.75, 0.75, 1.00] },
  15: { name: 'Woodland Premium',     uv: [0.75, 0.75, 1.00, 1.00] },
};

const HEX_TO_ATLAS = {
  '#1A1A1A': 5,  // Черный / Черное дерево -> Charcoal
  '#212121': 5,  // Эбен -> Charcoal
  '#293133': 5,  // Антрацит -> Charcoal
  '#383E42': 7,  // Графит -> Graphite Velvet
  '#4A5568': 7,  // Графит Woodvex -> Graphite Velvet
  '#808080': 6,  // Серый / Серый микс -> Silver Gray
  '#93917F': 4,  // Серый дым -> Ash Gray
  '#F0EBE0': 12, // Белый -> Light Gray Matte
  '#2F1E0E': 1,  // Венге -> Dark Chocolate
  '#3B2219': 1,  // Венге Woodvex -> Dark Chocolate
  '#3D1F10': 1,  // Шоколад -> Dark Chocolate
  '#3E2723': 13, // Темно-коричневый -> Brown Velvet
  '#654321': 9,  // Коричневый / Кофе -> Walnut
  '#5D4037': 9,  // Орех -> Walnut
  '#C4A77D': 2,  // Дуб -> Light Oak
  '#C2B280': 14, // Песочный -> Quicksand
  '#B76E2E': 0,  // Тик -> Honey Teak
  '#B57C48': 3,  // Тик Woodvex -> Classic Teak
  '#A07855': 10, // Вуд -> Cedar
  '#A52A2A': 8,  // Красный -> Mahogany
  '#8C3B2B': 8,  // Терракот -> Mahogany
  '#73343A': 8,  // Мербау -> Mahogany
};

const ATLAS_BASE_HEX = [
  '#B5783A', '#35251C', '#C4A67D', '#986036',
  '#A4A6A8', '#262729', '#909294', '#3A3E42',
  '#5A2C22', '#4E3627', '#7E4E30', '#5C5248',
  '#D2D3D5', '#443126', '#BAA07E', '#64442A',
];

const TEXTURE_OPTIONS = [
  { id: 'auto', name: 'По цвету товара (Атлас)', isAuto: true, colorHex: '#888888' },
  ...Object.entries(ATLAS_UV).map(([idx, item]) => ({
    id: String(idx),
    atlasIndex: Number(idx),
    name: item.name,
    colorHex: ATLAS_BASE_HEX[idx] || '#888888',
  })),
];

function findClosestAtlasIndex(variant) {
  if (!variant) return 0;
  const name = `${variant.name || ''} ${variant.colorName || ''}`.toLowerCase();

  // 1. Приоритет: точное попадание по ключевым словам из каталога
  if (/дуб/i.test(name)) return 2;             // Light Oak
  if (/тик/i.test(name)) return 0;             // Honey Teak
  if (/вуд|кедр/i.test(name)) return 10;       // Cedar
  if (/венге/i.test(name)) return 1;           // Dark Chocolate
  if (/шоколад/i.test(name)) return 1;        // Dark Chocolate
  if (/темно.*коричн|тёмно.*коричн/i.test(name)) return 13; // Brown Velvet
  if (/коричнев|кофе/i.test(name)) return 15;  // Woodland Premium (насыщенный теплый древесный)
  if (/черн|эбен|антрацит/i.test(name)) return 5; // Charcoal
  if (/графит/i.test(name)) return 7;          // Graphite Velvet
  if (/дым|пепел/i.test(name)) return 4;       // Ash Gray
  if (/серый|серебр/i.test(name)) return 6;    // Silver Gray
  if (/терракот|красн|мербау/i.test(name)) return 8; // Mahogany
  if (/песоч/i.test(name)) return 14;          // Quicksand
  if (/бел/i.test(name)) return 12;            // Light Gray Matte
  if (/орех/i.test(name)) return 9;            // Walnut

  // 2. Поиск по таблице HEX
  const clean = (variant.colorHex || '').toUpperCase();
  if (HEX_TO_ATLAS[clean] !== undefined) return HEX_TO_ATLAS[clean];

  // 3. Fallback: расчет евклидова расстояния RGB
  const r1 = parseInt(clean.slice(1, 3), 16) || 0;
  const g1 = parseInt(clean.slice(3, 5), 16) || 0;
  const b1 = parseInt(clean.slice(5, 7), 16) || 0;
  let best = 0;
  let minDist = Infinity;
  for (let i = 0; i < 16; i++) {
    const ref = ATLAS_BASE_HEX[i];
    const r2 = parseInt(ref.slice(1, 3), 16);
    const g2 = parseInt(ref.slice(3, 5), 16);
    const b2 = parseInt(ref.slice(5, 7), 16);
    const d = (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
    if (d < minDist) { minDist = d; best = i; }
  }
  return best;
}

const FALLBACK_PILLARS = [
  { variantId: 'demo-p100', name: 'Столб 100×100 (демо)', price: 0, image: null,
    dimensions: { width: 100, depth: 100, maxLength: 3000 }, colorHex: '#3b2f2a', textureUrl: null },
  { variantId: 'demo-p120', name: 'Столб 120×120 (демо)', price: 0, image: null,
    dimensions: { width: 120, depth: 120, maxLength: 3000 }, colorHex: '#6b4a2f', textureUrl: null },
];
const FALLBACK_BALUSTERS = [
  { variantId: 'demo-b40', name: 'Балясина 40×40 (демо)', price: 0, image: null,
    dimensions: { width: 40, depth: 40, maxLength: 3000 }, colorHex: '#3b2f2a', textureUrl: null },
  { variantId: 'demo-b50', name: 'Балясина 50×50 (демо)', price: 0, image: null,
    dimensions: { width: 50, depth: 50, maxLength: 3000 }, colorHex: '#6b4a2f', textureUrl: null },
];

const state = {
  shape: 'vertical-1',
  width: 1500,
  height: 1000,
  pillar: null,
  baluster: null,
  texture: 'auto',
  bg: 'white',
};

let renderer, camera, scene, controls, fenceGroup;
let catalog = { pillars: FALLBACK_PILLARS, balusters: FALLBACK_BALUSTERS };

const num = (v, def) => (Number(v) > 0 ? Number(v) : def);

function normalizeProducts(json) {
  const products = Array.isArray(json) ? json : (json && json.data) || [];
  const out = [];
  products.forEach((product) => {
    const attrs = product.attributes || {};
    const dimensions = {
      width: num(attrs.width_mm && attrs.width_mm.value, 50),
      depth: num(
        (attrs.thickness_mm && attrs.thickness_mm.value) ||
        (attrs.height_mm && attrs.height_mm.value), 50),
      maxLength: num(attrs.length_mm && attrs.length_mm.value, 3000),
    };
    (product.variants || []).forEach((variant) => {
      const vAttrs = variant.attributes || {};
      const hex = vAttrs.color && vAttrs.color.value && vAttrs.color.value.meta &&
        vAttrs.color.value.meta.hex;
      const colorLabel = (vAttrs.color && vAttrs.color.value && vAttrs.color.value.label) || '';
      out.push({
        variantId: variant.id,
        name: variant.name || product.name,
        colorName: colorLabel,
        price: (variant.prices && variant.prices.retail) || 0,
        image: variant.preview_picture || product.preview_picture || null,
        dimensions,
        colorHex: hex || '#1a1a1a',
        textureUrl: variant.preview_picture || null,
      });
    });
  });
  return out;
}

async function fetchProducts(productType) {
  const url = `${API_BASE}/all/products?product_type=${productType}&per_page=all`;
  const res = await fetch(url, { headers: API_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} (${productType})`);
  return normalizeProducts(await res.json());
}

async function loadCatalogData() {
  const [balusters, pillars] = await Promise.all([
    fetchProducts('baluster'),
    fetchProducts('pillar'),
  ]);
  return {
    balusters: balusters.filter((item) => /балясин/i.test(item.name)),
    pillars: pillars.filter((item) => /столб/i.test(item.name)),
  };
}

function clipPolygon(poly, xmin, ymin, xmax, ymax) {
  const clip = (pts, inside, cut) => {
    const out = [];
    pts.forEach((cur, i) => {
      const prev = pts[(i + pts.length - 1) % pts.length];
      const curIn = inside(cur);
      const prevIn = inside(prev);
      if (curIn) {
        if (!prevIn) out.push(cut(prev, cur));
        out.push(cur);
      } else if (prevIn) {
        out.push(cut(prev, cur));
      }
    });
    return out;
  };
  const atX = (x) => (a, b) => [x, a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1])];
  const atY = (y) => (a, b) => [a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), y];

  let pts = poly;
  pts = clip(pts, (p) => p[0] >= xmin, atX(xmin));
  if (pts.length) pts = clip(pts, (p) => p[0] <= xmax, atX(xmax));
  if (pts.length) pts = clip(pts, (p) => p[1] >= ymin, atY(ymin));
  if (pts.length) pts = clip(pts, (p) => p[1] <= ymax, atY(ymax));
  return pts;
}

function buildLayout(shape, W, H, pillar, baluster) {
  const parts = [];
  const bw = baluster.width;
  const pw = pillar.width;
  const IW = W - pw * 2;
  const add = (kind, cx, cy, w, h) => parts.push({ kind, cx, cy, w, h, angle: 0 });

  const px = W / 2 - pw / 2;
  add('pillar', -px, H / 2, pw, H);
  add('pillar', px, H / 2, pw, H);

  add('rail', 0, BOTTOM_GAP + bw / 2, IW, bw);
  add('rail', 0, H - TOP_GAP - bw / 2, IW, bw);

  const x0 = -IW / 2;
  const x1 = IW / 2;
  const y0 = BOTTOM_GAP + bw;
  const y1 = H - TOP_GAP - bw;

  const vertFill = (xa, xb, ya, yb, gap) => {
    const len = xb - xa;
    const count = Math.max(1, Math.round((len - bw) / (bw + gap)));
    const g = (len - count * bw) / (count + 1);
    for (let i = 0; i < count; i++) {
      add('baluster', xa + g * (i + 1) + bw * (i + 0.5), (ya + yb) / 2, bw, yb - ya);
    }
  };

  const horizFill = (xa, xb, ya, yb) => {
    const span = yb - ya;
    const count = Math.max(1, Math.round((span - bw) / (bw + HORIZ_GAP)));
    const g = (span - count * bw) / (count + 1);
    for (let i = 0; i < count; i++) {
      add('baluster', (xa + xb) / 2, ya + g * (i + 1) + bw * (i + 0.5), xb - xa, bw);
    }
  };

  const cross = (xa, xb, ya, yb, embedLeft, embedRight) => {
    const w = xb - xa;
    const h = yb - ya;
    const a = Math.atan2(h, w);
    const cx = (xa + xb) / 2;
    const cy = (ya + yb) / 2;
    const half = Math.hypot(w, h) / 2 + bw * 2;
    [1, -1].forEach((sign, idx) => {
      const c = Math.cos(sign * a);
      const s = Math.sin(sign * a);
      const band = [[-half, -bw / 2], [half, -bw / 2], [half, bw / 2], [-half, bw / 2]]
        .map(([lx, ly]) => [cx + lx * c - ly * s, cy + lx * s + ly * c]);
      const poly = clipPolygon(band, xa - embedLeft, ya - bw / 2, xb + embedRight, yb + bw / 2);
      if (poly.length > 2) parts.push({ kind: 'baluster', poly, inset: 2 + idx * 2 });
    });
  };

  const framed = shape === 'vertical-2' || shape === 'cross-2' || shape === 'cross-3';
  let lowTop = y1;
  if (framed) {
    const midBottom = y1 - FRAME_H - bw;
    add('rail', 0, midBottom + bw / 2, IW, bw);
    lowTop = midBottom;
    vertFill(x0, x1, midBottom + bw, y1, shape === 'vertical-2' ? VERT_GAP : FRAME_GAP);
  }

  switch (shape) {
    case 'vertical-1':
      vertFill(x0, x1, y0, y1, VERT_GAP);
      break;
    case 'vertical-2':
      vertFill(x0, x1, y0, lowTop, VERT_GAP);
      break;
    case 'horizontal-1':
      horizFill(x0, x1, y0, y1);
      break;
    case 'horizontal-2':
      add('baluster', 0, (y0 + y1) / 2, bw, y1 - y0);
      horizFill(x0, -bw / 2, y0, y1);
      horizFill(bw / 2, x1, y0, y1);
      break;
    case 'cross-1':
      cross(x0, x1, y0, y1, pw / 2, pw / 2);
      break;
    case 'cross-2':
      add('baluster', 0, (y0 + lowTop) / 2, bw, lowTop - y0);
      cross(x0, -bw / 2, y0, lowTop, pw / 2, bw / 2);
      cross(bw / 2, x1, y0, lowTop, bw / 2, pw / 2);
      break;
    case 'cross-3':
      cross(x0, x1, y0, lowTop, pw / 2, pw / 2);
      break;
  }
  return parts;
}

function makeShapeIcon(shapeId) {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 1500;
  const H = 1000;
  const parts = buildLayout(shapeId, W, H, { width: 100, depth: 100 }, { width: 40, depth: 40 });
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `${-W / 2 - 20} -20 ${W + 40} ${H + 40}`);
  parts.forEach((p) => {
    let el;
    if (p.poly) {
      el = document.createElementNS(NS, 'polygon');
      el.setAttribute('points', p.poly.map(([x, y]) => `${x},${H - y}`).join(' '));
    } else {
      el = document.createElementNS(NS, 'rect');
      el.setAttribute('x', p.cx - p.w / 2);
      el.setAttribute('y', H - p.cy - p.h / 2);
      el.setAttribute('width', p.w);
      el.setAttribute('height', p.h);
    }
    el.setAttribute('fill', p.kind === 'pillar' ? '#eee' : '#fff');
    el.setAttribute('stroke', '#aaa');
    el.setAttribute('stroke-width', '1.5');
    el.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(el);
  });
  return svg;
}

function initShapeSelector() {
  const root = document.querySelector('#shapes');
  SHAPES.forEach((s) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'shape-card';
    card.dataset.shape = s.id;
    card.appendChild(makeShapeIcon(s.id));
    const label = document.createElement('span');
    label.textContent = s.title;
    card.appendChild(label);
    card.addEventListener('click', () => {
      state.shape = s.id;
      markActiveShape();
      rebuildFence();
    });
    root.appendChild(card);
  });
  markActiveShape();
}

function markActiveShape() {
  document.querySelectorAll('.shape-card').forEach((c) =>
    c.classList.toggle('active', c.dataset.shape === state.shape));
}

function createThumb(item, size) {
  const box = document.createElement('div');
  box.className = 'rs-thumb';
  box.style.width = box.style.height = size + 'px';
  box.style.backgroundColor = item.colorHex || '#ccc';

  if (item.isAuto) {
    box.style.background = 'linear-gradient(135deg, #b5783a 0%, #35251c 50%, #808080 100%)';
  } else if (item.atlasIndex !== undefined) {
    const col = item.atlasIndex % 4;
    const row = Math.floor(item.atlasIndex / 4);
    box.style.backgroundImage = `url(${ATLAS_PATH})`;
    box.style.backgroundRepeat = 'no-repeat';
    box.style.backgroundSize = '400% 400%';
    box.style.backgroundPosition = `${col * (100 / 3)}% ${row * (100 / 3)}%`;
  } else if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = '';
    img.loading = 'lazy';
    img.onerror = () => img.remove();
    box.appendChild(img);
  }
  return box;
}

function formatPrice(p) {
  return p ? `${Number(p).toLocaleString('ru-RU')} ₽` : '';
}

function createRichSelect(root, items, onChange) {
  root.innerHTML = '';
  root.classList.add('rs');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'rs-btn';
  const list = document.createElement('div');
  list.className = 'rs-list';
  list.hidden = true;

  const fill = (el, item, size) => {
    el.appendChild(createThumb(item, size));
    const name = document.createElement('span');
    name.className = 'rs-name';
    name.textContent = item.name;
    const price = document.createElement('span');
    price.className = 'rs-price';
    price.textContent = formatPrice(item.price);
    el.append(name, price);
  };

  const select = (item, silent) => {
    btn.innerHTML = '';
    fill(btn, item, 32);
    const chev = document.createElement('span');
    chev.className = 'rs-chev';
    chev.textContent = '▼';
    btn.appendChild(chev);
    list.hidden = true;
    if (!silent) onChange(item);
  };

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'rs-item';
    fill(row, item, 40);
    row.addEventListener('click', () => select(item));
    list.appendChild(row);
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasHidden = list.hidden;
    document.querySelectorAll('.rs-list').forEach((l) => (l.hidden = true));
    list.hidden = !wasHidden;
  });
  document.addEventListener('click', () => (list.hidden = true));

  root.append(btn, list);
  if (items.length) select(items[0], true);
  return items[0] || null;
}

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');
const materialCache = new Map();
const croppedBaseCache = new Map();

const atlasImg = new Image();
atlasImg.src = ATLAS_PATH;
atlasImg.onload = () => {
  croppedBaseCache.clear();
  clearMaterials();
  rebuildFence();
};

function createCroppedTexture(atlas, uv, inset = 0.012) {
  const [u0, v0, u1, v1] = uv;
  const w = atlas.image.width || atlas.image.naturalWidth;
  const h = atlas.image.height || atlas.image.naturalHeight;
  if (!w || !h) return null;

  const sx = Math.floor((u0 + inset) * w);
  const sy = Math.floor((v0 + inset) * h);
  const sw = Math.floor((u1 - u0 - inset * 2) * w);
  const sh = Math.floor((v1 - v0 - inset * 2) * h);

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, sw);
  canvas.height = Math.max(1, sh);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(atlas.image, sx, sy, sw, sh, 0, 0, sw, sh);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.MirroredRepeatWrapping;
  tex.wrapT = THREE.MirroredRepeatWrapping;
  if (THREE.SRGBColorSpace) {
    tex.colorSpace = THREE.SRGBColorSpace;
  } else if (THREE.sRGBEncoding) {
    tex.encoding = THREE.sRGBEncoding;
  }
  if (renderer && renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }
  tex.needsUpdate = true;
  return tex;
}

function getAtlasTextureInstance(index, rx, ry, vertical) {
  if (!atlasImg.complete || !atlasImg.naturalWidth) return null;
  let base = croppedBaseCache.get(index);
  if (!base) {
    const item = ATLAS_UV[index];
    if (!item) return null;
    base = createCroppedTexture({ image: atlasImg }, item.uv, 0.012);
    if (!base) return null;
    croppedBaseCache.set(index, base);
  }
  const tex = base.clone();
  tex.wrapS = THREE.MirroredRepeatWrapping;
  tex.wrapT = THREE.MirroredRepeatWrapping;
  if (vertical) {
    tex.center.set(0.5, 0.5);
    tex.rotation = Math.PI / 2;
  }
  tex.repeat.set(rx, ry);
  tex.needsUpdate = true;
  return tex;
}

function getMaterial(variant, w, h, poly) {
  const atlasIndex = state.texture === 'auto'
    ? findClosestAtlasIndex(variant)
    : Number(state.texture);
  const vertical = !poly && h > w;
  const rx = poly ? 1 / 250 : (vertical ? h : w) / 300;
  const ry = poly ? 1 / 250 : (vertical ? w : h) / 300;

  const key = `${variant.variantId}|${atlasIndex}|${vertical}|${rx.toFixed(4)}|${ry.toFixed(4)}`;
  if (materialCache.has(key)) return materialCache.get(key);

  const mat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.65,
    metalness: 0.05,
  });

  const tex = getAtlasTextureInstance(atlasIndex, rx, ry, vertical);
  if (tex) mat.map = tex;

  materialCache.set(key, mat);
  return mat;
}

function clearMaterials() {
  materialCache.forEach((m) => {
    if (m.map) m.map.dispose();
    m.dispose();
  });
  materialCache.clear();
}

function clampDim(v, [min, max]) {
  return Math.min(max, Math.max(min, Number(v) || min));
}

function createPolyGeometry(poly, depth) {
  const shape = new THREE.Shape();
  poly.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

function rebuildFence() {
  if (!scene || !state.pillar || !state.baluster) return;

  if (fenceGroup) {
    scene.remove(fenceGroup);
    fenceGroup.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
    });
  }
  clearMaterials();

  const W = clampDim(state.width, LIMITS.width);
  const H = clampDim(state.height, LIMITS.height);
  const pil = state.pillar.dimensions;
  const bal = state.baluster.dimensions;

  const parts = buildLayout(state.shape, W, H, pil, bal);
  fenceGroup = new THREE.Group();

  parts.forEach((p) => {
    const isPillar = p.kind === 'pillar';
    const variant = isPillar ? state.pillar : state.baluster;
    const depth = isPillar ? pil.depth : bal.depth;
    let mesh;
    let geometry;

    if (p.poly) {
      geometry = createPolyGeometry(p.poly, depth - p.inset);
      mesh = new THREE.Mesh(geometry, getMaterial(variant, 0, 0, true));
    } else {
      geometry = new THREE.BoxGeometry(p.w, p.h, depth);
      mesh = new THREE.Mesh(geometry, getMaterial(variant, p.w, p.h, false));
      mesh.position.set(p.cx, p.cy, 0);
    }
    mesh.name = p.kind;
    fenceGroup.add(mesh);
  });

  scene.add(fenceGroup);
  controls.target.set(0, H / 2, 0);
}

function initRender() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(650, 650);
  renderer.setClearColor(0xffffff);
  document.querySelector('#content').append(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, 1, 0.2, 20000);
  camera.position.set(1200, 1000, 3200);
}

function initScene() {
  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const sun = new THREE.DirectionalLight(0xffffff, 0.85);
  sun.position.set(1500, 2500, 3000);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xffffff, 0.45);
  fill.position.set(-1500, 1000, 2000);
  scene.add(fill);
  const back = new THREE.DirectionalLight(0xffffff, 0.35);
  back.position.set(-1500, 800, -2000);
  scene.add(back);
}

function changeBackground(name) {
  if (name === 'no') {
    scene.background = null;
  } else if (name === 'white') {
    scene.background = new THREE.Color(0xffffff);
  } else {
    const loader = new THREE.CubeTextureLoader();
    loader.setPath(`./textures/cube/${name}/`);
    scene.background = loader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  }
}

function initControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.minDistance = 300;
  controls.maxDistance = 8000;
  controls.target.set(0, state.height / 2, 0);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function initInputs() {
  const bind = (el, key) => {
    el.addEventListener('input', () => {
      state[key] = clampDim(el.value, LIMITS[key]);
      rebuildFence();
    });
    el.addEventListener('change', () => {
      state[key] = clampDim(el.value, LIMITS[key]);
      el.value = state[key];
      rebuildFence();
    });
  };
  bind(document.querySelector('#width'), 'width');
  bind(document.querySelector('#height'), 'height');

  document.querySelector('#bg').addEventListener('change', (e) => {
    state.bg = e.target.value;
    changeBackground(state.bg);
  });
  document.querySelector('#data').addEventListener('submit', (e) => e.preventDefault());
}

function initTextureSelect() {
  createRichSelect(document.querySelector('#texture'), TEXTURE_OPTIONS,
    (item) => { state.texture = item.id; rebuildFence(); });
}

function initCatalogSelects() {
  state.pillar = createRichSelect(document.querySelector('#pillar'), catalog.pillars,
    (item) => { state.pillar = item; rebuildFence(); });
  state.baluster = createRichSelect(document.querySelector('#baluster'), catalog.balusters,
    (item) => { state.baluster = item; rebuildFence(); });
}

function setStatus(text, isError) {
  const el = document.querySelector('#status');
  el.textContent = text;
  el.classList.toggle('error', !!isError);
}

async function init() {
  initRender();
  initScene();
  initCamera();
  initControls();
  changeBackground(state.bg);
  initShapeSelector();
  initInputs();
  initCatalogSelects();
  initTextureSelect();
  rebuildFence();
  animate();

  setStatus('Загрузка каталога…');
  try {
    const data = await loadCatalogData();
    if (!data.pillars.length || !data.balusters.length) {
      throw new Error('каталог пуст');
    }
    catalog = data;
    initCatalogSelects();
    rebuildFence();
    setStatus(`Каталог загружен: столбов — ${data.pillars.length}, балясин — ${data.balusters.length}`);
  } catch (err) {
    console.warn('Каталог недоступен, используются демо-данные:', err);
    setStatus(`Не удалось загрузить каталог (${err.message}). Показаны демо-данные.`, true);
  }
}

init();