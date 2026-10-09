import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Building } from '../../types';
import { buildingsData } from '../../data/buildingsData';
import { Building2, Sparkles, Navigation } from 'lucide-react';

interface MasterPlanSceneProps {
  selectedBuilding: Building | null;
  onSelectBuilding: (building: Building) => void;
  onDeselectBuilding: () => void;
}

interface ProjectedBadge {
  building: Building;
  x: number;
  y: number;
  visible: boolean;
}

export const MasterPlanScene: React.FC<MasterPlanSceneProps> = ({
  selectedBuilding,
  onSelectBuilding,
  onDeselectBuilding,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances ref
  const threeRefs = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    buildingMeshes: Map<string, THREE.Group>;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    animatingCamera: boolean;
    targetCamPos: THREE.Vector3;
    targetControlsTarget: THREE.Vector3;
    defaultCamPos: THREE.Vector3;
    defaultControlsTarget: THREE.Vector3;
    reqId: number;
  } | null>(null);

  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [projectedBadges, setProjectedBadges] = useState<ProjectedBadge[]>([]);

  // Default camera overview positions
  const defaultCamPos = useMemo(() => new THREE.Vector3(0, 30, 26), []);
  const defaultControlsTarget = useMemo(() => new THREE.Vector3(0, 0, -3.5), []);

  // Helper to generate the architectural Master Plan canvas texture
  const createMasterPlanTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    // 1. Warm Architectural Base Ground
    ctx.fillStyle = '#F5F4F0';
    ctx.fillRect(0, 0, 2048, 2048);

    // Subtle grid/texture lines
    ctx.strokeStyle = '#ECEAE3';
    ctx.lineWidth = 1;
    const step = 64;
    for (let x = 0; x <= 2048; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2048);
      ctx.stroke();
    }
    for (let y = 0; y <= 2048; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      ctx.stroke();
    }

    // 2. Secondary Road Network (White roadways with subtle borders)
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const drawRoad = (points: [number, number][], width: number) => {
      // Outer border / curb
      ctx.strokeStyle = '#D6D4CB';
      ctx.lineWidth = width + 4;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.stroke();

      // Inner pavement
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.stroke();
    };

    // Main Avenue running vertically
    drawRoad(
      [
        [720, 2000],
        [740, 1500],
        [780, 1100],
        [760, 700],
        [700, 200],
      ],
      48
    );

    // Avenue branching right towards Moondys / Kalicaah
    drawRoad(
      [
        [760, 1100],
        [980, 1050],
        [1250, 1050],
        [1500, 1120],
        [1850, 1150],
      ],
      40
    );

    // Diagonal connector road
    drawRoad(
      [
        [740, 1500],
        [600, 1850],
      ],
      32
    );

    // Cross Street 1 (North)
    drawRoad(
      [
        [200, 650],
        [760, 700],
        [1100, 680],
        [1500, 650],
        [1900, 600],
      ],
      36
    );

    // Cross Street 2 (Far North)
    drawRoad(
      [
        [200, 350],
        [700, 370],
        [1200, 360],
        [1800, 350],
      ],
      30
    );

    // Road circling Kalicaah block
    drawRoad(
      [
        [1250, 1050],
        [1300, 1400],
        [1750, 1450],
        [1850, 1150],
      ],
      28
    );

    // Left Residential Streets
    drawRoad(
      [
        [380, 200],
        [390, 800],
        [370, 1400],
      ],
      30
    );

    // 3. Defined Parcels & Plots
    // Plot A: KALICAAH Primary Commercial Plot
    ctx.strokeStyle = '#C9C6BC';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#FAF9F6';
    ctx.beginPath();
    ctx.roundRect(850, 1150, 700, 480, 24);
    ctx.fill();
    ctx.stroke();

    // Plot B: North Block (Moondys & Corporate)
    ctx.beginPath();
    ctx.roundRect(850, 780, 650, 220, 16);
    ctx.fillStyle = '#F8F7F3';
    ctx.fill();
    ctx.stroke();

    // Plot C: Cultural Grove (Reading Pavilion)
    ctx.beginPath();
    ctx.roundRect(240, 750, 440, 520, 18);
    ctx.fillStyle = '#F4F7F4'; // subtle greenish architectural park tint
    ctx.fill();
    ctx.stroke();

    // Plot D: Waterfront Villa Enclave
    ctx.beginPath();
    ctx.roundRect(1400, 380, 550, 450, 20);
    ctx.fillStyle = '#F3F6F9'; // subtle blue-tinted coastal enclave
    ctx.fill();
    ctx.stroke();

    // 4. Large Ground Typography: *KALICAAH* (Matching Reference Design)
    ctx.save();
    ctx.font = 'italic bold 58px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#555555';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '8px';
    ctx.fillText('K A L I C A A H', 1200, 1380);
    ctx.restore();

    // Secondary subtle zone labels
    ctx.save();
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#8E8C84';
    ctx.textAlign = 'center';
    ctx.fillText('COMMERCIAL HUB', 1200, 1440);
    ctx.fillText('CULTURAL & CREATIVE ZONE', 460, 1010);
    ctx.fillText('WATERFRONT SANCTUARY', 1670, 610);
    ctx.restore();

    // 5. Foreground Arterial Highway (Dual Orange/Yellow Band as in Reference Screenshot)
    const highwayY = 1940;
    // Outer road base
    ctx.strokeStyle = '#D2CEBF';
    ctx.lineWidth = 92;
    ctx.beginPath();
    ctx.moveTo(100, highwayY);
    ctx.bezierCurveTo(700, highwayY - 60, 1400, highwayY + 30, 2000, highwayY - 20);
    ctx.stroke();

    // Yellow / Orange asphalt fill
    ctx.strokeStyle = '#F6A83E';
    ctx.lineWidth = 82;
    ctx.beginPath();
    ctx.moveTo(100, highwayY);
    ctx.bezierCurveTo(700, highwayY - 60, 1400, highwayY + 30, 2000, highwayY - 20);
    ctx.stroke();

    // White Center Median Barrier
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(100, highwayY);
    ctx.bezierCurveTo(700, highwayY - 60, 1400, highwayY + 30, 2000, highwayY - 20);
    ctx.stroke();

    // Highway Curb Edge Lines
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, highwayY - 38);
    ctx.bezierCurveTo(700, highwayY - 98, 1400, highwayY - 8, 2000, highwayY - 58);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, highwayY + 38);
    ctx.bezierCurveTo(700, highwayY - 22, 1400, highwayY + 68, 2000, highwayY + 18);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    texture.generateMipmaps = true;
    return texture;
  };

  // Build architectural 3D geometry for Architecture Moondys (Curved/Angled commercial block)
  const buildMoondysGeometry = (): THREE.Group => {
    const group = new THREE.Group();

    // Main 10-floor curved/angled glass massing
    const baseGeo = new THREE.BoxGeometry(4.2, 3.6, 2.2);
    const mainMat = new THREE.MeshStandardMaterial({
      color: 0x303CB5, // Rich architectural cobalt blue
      roughness: 0.35,
      metalness: 0.25,
      emissive: 0x18227A,
      emissiveIntensity: 0.25,
    });
    const mainMesh = new THREE.Mesh(baseGeo, mainMat);
    mainMesh.position.set(0, 1.8, 0);
    mainMesh.castShadow = true;
    mainMesh.receiveShadow = true;
    group.add(mainMesh);

    // Upper setback / penthouse tier
    const topGeo = new THREE.BoxGeometry(3.0, 1.4, 1.6);
    const topMesh = new THREE.Mesh(topGeo, mainMat);
    topMesh.position.set(-0.3, 4.3, 0);
    topMesh.castShadow = true;
    group.add(topMesh);

    // Stepped wing (as seen in reference image)
    const wingGeo = new THREE.BoxGeometry(2.0, 2.2, 1.8);
    const wingMesh = new THREE.Mesh(wingGeo, mainMat);
    wingMesh.position.set(-2.5, 1.1, -0.2);
    wingMesh.castShadow = true;
    group.add(wingMesh);

    // Elegant window band louvers / horizontal floor plates
    const floorPlateGeo = new THREE.BoxGeometry(4.35, 0.08, 2.35);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x5665E0,
      roughness: 0.2,
      metalness: 0.4,
    });
    for (let f = 0; f < 5; f++) {
      const plate = new THREE.Mesh(floorPlateGeo, plateMat);
      plate.position.set(0, 0.6 + f * 0.75, 0);
      group.add(plate);
    }

    // Base podium
    const podiumGeo = new THREE.BoxGeometry(5.2, 0.3, 3.2);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0xEAE7DF,
      roughness: 0.8,
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.set(-0.5, 0.15, 0);
    podium.receiveShadow = true;
    group.add(podium);

    group.userData = { buildingId: 'architecture-moondys' };
    return group;
  };

  // Build architectural 3D geometry for Kalicaah Reading Pavilion
  const buildReadingRoomGeometry = (): THREE.Group => {
    const group = new THREE.Group();

    // Low-rise timber pavilion base
    const baseGeo = new THREE.BoxGeometry(3.2, 1.4, 2.4);
    const mainMat = new THREE.MeshStandardMaterial({
      color: 0x303CB5,
      roughness: 0.4,
      metalness: 0.2,
      emissive: 0x18227A,
      emissiveIntensity: 0.25,
    });
    const mainMesh = new THREE.Mesh(baseGeo, mainMat);
    mainMesh.position.set(0, 0.7, 0);
    mainMesh.castShadow = true;
    mainMesh.receiveShadow = true;
    group.add(mainMesh);

    // Wide overhanging architectural canopy roof
    const roofGeo = new THREE.BoxGeometry(4.0, 0.2, 3.0);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x505FD9,
      roughness: 0.3,
    });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.set(0, 1.5, 0);
    roofMesh.castShadow = true;
    group.add(roofMesh);

    // Outdoor reading terrace / timber deck
    const deckGeo = new THREE.BoxGeometry(4.8, 0.15, 3.6);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0xE6E2D8, roughness: 0.9 });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 0.08, 0);
    deck.receiveShadow = true;
    group.add(deck);

    group.userData = { buildingId: 'reading-room' };
    return group;
  };

  // Build architectural 3D geometry for Utlida 180 Premium Villa
  const buildUtlidaGeometry = (): THREE.Group => {
    const group = new THREE.Group();

    // 3-floor coastal villa volumes
    const lowerGeo = new THREE.BoxGeometry(3.6, 1.2, 2.8);
    const mainMat = new THREE.MeshStandardMaterial({
      color: 0x303CB5,
      roughness: 0.35,
      metalness: 0.2,
      emissive: 0x18227A,
      emissiveIntensity: 0.25,
    });
    const lowerMesh = new THREE.Mesh(lowerGeo, mainMat);
    lowerMesh.position.set(0, 0.6, 0);
    lowerMesh.castShadow = true;
    group.add(lowerMesh);

    // Cantilevered upper master suite
    const upperGeo = new THREE.BoxGeometry(2.8, 1.2, 2.0);
    const upperMesh = new THREE.Mesh(upperGeo, mainMat);
    upperMesh.position.set(0.6, 1.8, -0.3);
    upperMesh.castShadow = true;
    group.add(upperMesh);

    // Sundeck & Infinity Pool terrace
    const terraceGeo = new THREE.BoxGeometry(4.6, 0.2, 3.8);
    const terraceMat = new THREE.MeshStandardMaterial({ color: 0xEAE7DF, roughness: 0.8 });
    const terrace = new THREE.Mesh(terraceGeo, terraceMat);
    terrace.position.set(0.2, 0.1, 0);
    terrace.receiveShadow = true;
    group.add(terrace);

    // Turquoise plunge pool reflection
    const poolGeo = new THREE.BoxGeometry(1.6, 0.08, 1.2);
    const poolMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      roughness: 0.1,
      metalness: 0.6,
    });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.set(1.4, 0.22, 1.0);
    group.add(pool);

    group.userData = { buildingId: 'utlida-residence' };
    return group;
  };

  // Build stylized surrounding contextual buildings (matching the architectural model look)
  const buildSurroundingCityBuildings = (scene: THREE.Scene) => {
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0xDCD9CE, // Light architectural plaster
      roughness: 0.8,
      metalness: 0.05,
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: 0xD0CCC0,
      roughness: 0.7,
      metalness: 0.05,
    });

    // Helper to spawn a city block
    const addBuilding = (
      w: number,
      h: number,
      d: number,
      x: number,
      z: number,
      rotY: number = 0
    ) => {
      const group = new THREE.Group();

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), buildingMat);
      mesh.position.set(0, h / 2, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // Parapet roof rim
      const roof = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.15, d * 0.85), roofMat);
      roof.position.set(0, h + 0.08, 0);
      group.add(roof);

      group.position.set(x, 0, z);
      group.rotation.y = rotY;
      scene.add(group);
    };

    // 1. Cluster A: Left Urban Residential & Mixed-Use Blocks
    addBuilding(1.8, 1.6, 1.4, -9.5, -4.5, 0.1);
    addBuilding(1.6, 2.2, 1.8, -11.5, -5.0, -0.05);
    addBuilding(2.0, 1.4, 1.6, -8.0, -7.0, 0.15);
    addBuilding(1.5, 1.8, 1.5, -10.2, -8.5, 0.0);
    addBuilding(1.7, 2.6, 1.5, -12.5, -8.0, -0.1);
    addBuilding(2.2, 1.5, 1.6, -9.0, -11.0, 0.05);
    addBuilding(1.8, 2.0, 1.8, -11.8, -11.5, 0.1);
    addBuilding(1.6, 1.4, 1.4, -7.5, -13.5, -0.2);

    // Near highway left
    addBuilding(2.0, 1.8, 1.6, -8.5, 2.5, 0.1);
    addBuilding(1.7, 1.5, 1.5, -10.8, 1.8, -0.15);
    addBuilding(1.9, 2.2, 1.7, -9.2, 5.0, 0.05);
    addBuilding(1.6, 1.4, 1.5, -11.5, 4.2, 0.1);

    // 2. Cluster B: North Commercial District (Surrounding Moondys)
    addBuilding(2.8, 2.4, 2.0, -4.5, -9.5, 0.05);
    addBuilding(2.4, 3.2, 2.2, -1.5, -11.0, 0.0);
    addBuilding(3.0, 2.8, 2.4, 2.5, -10.5, -0.1);
    addBuilding(2.2, 1.8, 1.8, 5.5, -9.0, 0.15);

    // Far North Skyline
    addBuilding(2.2, 3.8, 2.0, -6.5, -16.0, 0.0);
    addBuilding(2.8, 4.5, 2.4, -2.5, -17.5, 0.05);
    addBuilding(3.2, 5.2, 2.6, 1.5, -18.0, -0.05);
    addBuilding(2.5, 4.0, 2.2, 5.5, -17.0, 0.1);
    addBuilding(2.0, 3.2, 2.0, 8.5, -16.0, -0.1);

    // 3. Cluster C: Right Waterfront Enclave Blocks
    addBuilding(2.0, 1.6, 1.8, 7.5, -3.5, -0.1);
    addBuilding(2.4, 2.0, 2.0, 10.5, -4.5, 0.15);
    addBuilding(1.8, 1.4, 1.6, 12.5, -6.5, -0.05);
    addBuilding(2.2, 1.8, 1.8, 8.0, -7.5, 0.2);
    addBuilding(2.0, 2.4, 2.2, 12.8, -10.0, -0.1);
    addBuilding(1.9, 1.5, 1.7, 7.0, -13.5, 0.05);

    // Along foreground highway right
    addBuilding(2.4, 1.8, 2.0, 7.5, 2.0, -0.1);
    addBuilding(2.0, 1.5, 1.8, 10.2, 1.2, 0.1);
    addBuilding(2.5, 2.2, 2.0, 8.5, 4.8, 0.05);
  };

  // Main Three.js lifecycle
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF3F1EC);
    scene.fog = new THREE.FogExp2(0xF3F1EC, 0.01);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 300);
    camera.position.copy(defaultCamPos);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minPolarAngle = Math.PI / 6.0;
    controls.minDistance = 12;
    controls.maxDistance = 85;
    controls.target.copy(defaultControlsTarget);
    controls.update();

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.15);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xEAF0FF, 0xF2EAE0, 0.45);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xFFF9F0, 1.85);
    sunLight.position.set(24, 46, 22);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 120;
    const d = 32;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    // 6. Ground Plane with Master Plan Texture
    const groundGeo = new THREE.PlaneGeometry(64, 64);
    const groundTexture = createMasterPlanTexture();
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTexture,
      roughness: 0.9,
      metalness: 0.05,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = 0;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // 7. Surrounding Architectural Massing
    buildSurroundingCityBuildings(scene);

    // 8. Interactive Selectable Buildings
    const buildingMeshes = new Map<string, THREE.Group>();

    // Building 1: Moondys
    const moondysMesh = buildMoondysGeometry();
    const b1 = buildingsData[0];
    moondysMesh.position.set(b1.mapPosition.x, b1.mapPosition.y, b1.mapPosition.z);
    scene.add(moondysMesh);
    buildingMeshes.set(b1.id, moondysMesh);

    // Building 2: Reading Room
    const readingMesh = buildReadingRoomGeometry();
    const b2 = buildingsData[1];
    readingMesh.position.set(b2.mapPosition.x, b2.mapPosition.y, b2.mapPosition.z);
    scene.add(readingMesh);
    buildingMeshes.set(b2.id, readingMesh);

    // Building 3: Utlida 180
    const utlidaMesh = buildUtlidaGeometry();
    const b3 = buildingsData[2];
    utlidaMesh.position.set(b3.mapPosition.x, b3.mapPosition.y, b3.mapPosition.z);
    scene.add(utlidaMesh);
    buildingMeshes.set(b3.id, utlidaMesh);

    // 9. Raycasting Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const refs = {
      renderer,
      scene,
      camera,
      controls,
      buildingMeshes,
      raycaster,
      mouse,
      animatingCamera: false,
      targetCamPos: new THREE.Vector3().copy(defaultCamPos),
      targetControlsTarget: new THREE.Vector3().copy(defaultControlsTarget),
      defaultCamPos,
      defaultControlsTarget,
      reqId: 0,
    };
    threeRefs.current = refs;

    // 10. Animation Loop
    const tempVec = new THREE.Vector3();
    const clock = new THREE.Clock();

    const animate = () => {
      refs.reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation towards target
      if (refs.animatingCamera) {
        camera.position.lerp(refs.targetCamPos, 0.05);
        controls.target.lerp(refs.targetControlsTarget, 0.05);
        controls.update();

        if (
          camera.position.distanceTo(refs.targetCamPos) < 0.1 &&
          controls.target.distanceTo(refs.targetControlsTarget) < 0.1
        ) {
          refs.animatingCamera = false;
        }
      } else {
        controls.update();
      }

      // Subtle breathing pulse on selected building
      buildingMeshes.forEach((mesh, id) => {
        const isSelected = selectedBuilding?.id === id;
        const isHovered = hoveredBuildingId === id;

        if (isSelected) {
          const bounce = Math.sin(elapsedTime * 3) * 0.08;
          mesh.position.y = bounce + 0.15;
        } else if (isHovered) {
          mesh.position.y = 0.12;
        } else {
          mesh.position.y = 0;
        }
      });

      renderer.render(scene, camera);

      // Project 3D building positions to 2D screen coordinates for DOM badges
      const badges: ProjectedBadge[] = [];
      buildingsData.forEach((b) => {
        const mesh = buildingMeshes.get(b.id);
        if (!mesh) return;

        tempVec.set(b.mapPosition.x, b.mapPosition.y + 4.5, b.mapPosition.z);
        tempVec.project(camera);

        const isBehind = tempVec.z > 1.0;
        const screenX = ((tempVec.x + 1) * width) / 2;
        const screenY = ((-tempVec.y + 1) * height) / 2;

        badges.push({
          building: b,
          x: screenX,
          y: screenY,
          visible: !isBehind,
        });
      });
      setProjectedBadges(badges);
    };

    animate();

    // 11. Responsive Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(refs.reqId);
      controls.dispose();
      renderer.dispose();
      groundTexture.dispose();
      groundGeo.dispose();
      threeRefs.current = null;
    };
  }, [defaultCamPos, defaultControlsTarget]);

  // Handle Raycasting Pointer Move (Hover state)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const refs = threeRefs.current;
    if (!refs || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    refs.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    refs.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    refs.raycaster.setFromCamera(refs.mouse, refs.camera);

    const interactiveObjects: THREE.Object3D[] = [];
    refs.buildingMeshes.forEach((group) => {
      interactiveObjects.push(...group.children);
    });

    const intersects = refs.raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      let current: THREE.Object3D | null = intersects[0].object;
      let buildingId: string | null = null;
      while (current) {
        if (current.userData?.buildingId) {
          buildingId = current.userData.buildingId;
          break;
        }
        current = current.parent;
      }

      setHoveredBuildingId(buildingId);
      if (buildingId) {
        canvasRef.current.style.cursor = 'pointer';
      }
    } else {
      setHoveredBuildingId(null);
      canvasRef.current.style.cursor = 'grab';
    }
  };

  // Handle Raycasting Pointer Click (Select building)
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const refs = threeRefs.current;
    if (!refs || !canvasRef.current) return;

    // Only count as click if pointer hasn't dragged more than 5 pixels
    const dx = Math.abs(e.clientX - pointerDownPos.current.x);
    const dy = Math.abs(e.clientY - pointerDownPos.current.y);
    if (dx > 6 || dy > 6) return;

    const rect = canvasRef.current.getBoundingClientRect();
    refs.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    refs.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    refs.raycaster.setFromCamera(refs.mouse, refs.camera);

    const interactiveObjects: THREE.Object3D[] = [];
    refs.buildingMeshes.forEach((group) => {
      interactiveObjects.push(...group.children);
    });

    const intersects = refs.raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      let current: THREE.Object3D | null = intersects[0].object;
      let buildingId: string | null = null;
      while (current) {
        if (current.userData?.buildingId) {
          buildingId = current.userData.buildingId;
          break;
        }
        current = current.parent;
      }

      if (buildingId) {
        const found = buildingsData.find((b) => b.id === buildingId);
        if (found) {
          onSelectBuilding(found);
        }
      }
    }
  };

  // Update materials and camera framing when selectedBuilding changes
  useEffect(() => {
    const refs = threeRefs.current;
    if (!refs) return;

    // Update building materials
    refs.buildingMeshes.forEach((group, id) => {
      const isSelected = selectedBuilding?.id === id;
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat) {
            if (isSelected) {
              mat.color.setHex(0x2736C2); // Deep vibrant cobalt blue
              mat.emissive.setHex(0x1B2482);
              mat.emissiveIntensity = 0.45;
            } else {
              mat.color.setHex(0x303CB5); // Default blue
              mat.emissive.setHex(0x18227A);
              mat.emissiveIntensity = 0.2;
            }
          }
        }
      });
    });

    // Animate camera to focus on selected building (offset to left for right side panel)
    if (selectedBuilding) {
      const pos = selectedBuilding.mapPosition;
      // Frame building nicely on the left portion of the screen
      refs.targetControlsTarget.set(pos.x + 1.2, 1.5, pos.z);
      refs.targetCamPos.set(pos.x + 2.5, 14, pos.z + 18);
      refs.animatingCamera = true;
    } else {
      // Reset camera to default overview vantage point
      refs.targetControlsTarget.copy(refs.defaultControlsTarget);
      refs.targetCamPos.copy(refs.defaultCamPos);
      refs.animatingCamera = true;
    }
  }, [selectedBuilding]);

  // Reset Camera View handler
  const handleResetCamera = useCallback(() => {
    onDeselectBuilding();
  }, [onDeselectBuilding]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none bg-[#F3F1EC]">
      {/* Three.js WebGL Canvas */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="w-full h-full block cursor-grab active:cursor-grabbing outline-none"
      />

      {/* 3D-Anchored Interactive DOM Badges (Matching Reference Ribbon & Icon Style) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {projectedBadges.map((badge) => {
          if (!badge.visible) return null;
          const isSelected = selectedBuilding?.id === badge.building.id;
          const isHovered = hoveredBuildingId === badge.building.id;

          return (
            <div
              key={badge.building.id}
              style={{
                transform: `translate3d(${badge.x}px, ${badge.y}px, 0) translate(-50%, -100%)`,
              }}
              className="absolute left-0 top-0 pointer-events-auto transition-transform duration-150"
            >
              <div className="flex flex-col items-center group cursor-pointer">
                {/* Diamond Building Icon (as in reference image) */}
                <button
                  type="button"
                  onClick={() => onSelectBuilding(badge.building)}
                  className={`mb-1.5 w-7 h-7 rotate-45 flex items-center justify-center rounded-sm shadow-md transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-700 ring-2 ring-white scale-110 shadow-blue-700/50'
                      : isHovered
                      ? 'bg-indigo-600 scale-105'
                      : 'bg-white/90 hover:bg-white text-blue-700 border border-blue-200'
                  }`}
                  title={`Pilih ${badge.building.name}`}
                >
                  <Building2
                    className={`w-3.5 h-3.5 -rotate-45 ${
                      isSelected || isHovered ? 'text-white' : 'text-blue-700'
                    }`}
                  />
                </button>

                {/* Ribbon Name Badge (Matching Reference: Architecture Moondys) */}
                <button
                  type="button"
                  onClick={() => onSelectBuilding(badge.building)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold tracking-tight whitespace-nowrap shadow-md transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-700 text-white ring-2 ring-white shadow-blue-800/40 scale-105'
                      : isHovered
                      ? 'bg-blue-600 text-white shadow-blue-600/30'
                      : 'bg-[#DDE5FA] text-[#243399] border border-blue-300/80 hover:bg-white hover:text-blue-800'
                  }`}
                >
                  <span>{badge.building.name}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Navigation Hint */}
      <div className="absolute left-6 bottom-6 z-20 pointer-events-none hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-black/10 text-[11px] text-gray-600 shadow-sm">
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Putar: Geser Mouse • Perbesar: Scroll • Pilih: Klik Bangunan</span>
        </div>
      </div>
    </div>
  );
};
