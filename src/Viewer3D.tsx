import { AmbientLight, CubeTexture, CubeTextureLoader, DirectionalLight, DoubleSide, Group, HalfFloatType, Material, Mesh, MeshPhongMaterial, MeshStandardMaterial, PerspectiveCamera, PointLight, Raycaster, Scene, SRGBColorSpace, TextureLoader, Vector2, WebGLRenderer } from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import type { MaterialData } from "./materialsData";
import type { CubeState, MaterialName } from "./store/reducers/cubeMaterialsSlice";
import { MaterialType } from './store/reducers/cubeMaterialsSlice'
import { BlendFunction, EdgeDetectionMode, EffectComposer, EffectPass, OutlineEffect, RenderPass, SMAAEffect, SMAAPreset } from "postprocessing";
import { isSomething } from 'tsjam'


type MaterialsData = {[key in MaterialName]: MaterialData}
type CubeMaterials = Record<string, { PBR: Material, Phong: Material}>

export class Viewer3D {
    private camera!: PerspectiveCamera
    private scene!: Scene
    private renderer: WebGLRenderer
    private materials?: CubeMaterials = {}
    private GLTFLoader = new GLTFLoader()
    private cube!:Group
    private controls!: OrbitControls
    private transformControls!: TransformControls
    private cubeTexture!: CubeTexture
    private composer!: EffectComposer
    private raycaster!: Raycaster
    private outlineEffect!: OutlineEffect

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new WebGLRenderer({ 
            canvas,
            powerPreference: 'high-performance',
            antialias: false,
            stencil: false,
            depth: false
        });
        

        window.addEventListener( 'resize', this.resize );
    }

    private initialized = false

    async init(materials: MaterialsData) {
        this.renderer.outputColorSpace = SRGBColorSpace
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.shadowMap.enabled = true

        this.camera = new PerspectiveCamera( 42, 1, 0.01, 100 );
        this.camera.position.set(-5, 5, 5)
        this.scene = new Scene();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.raycaster = new Raycaster()

		const smaaEffect = new SMAAEffect({
            preset: SMAAPreset.HIGH,
			edgeDetectionMode: EdgeDetectionMode.COLOR
        });
		smaaEffect.edgeDetectionMaterial.setEdgeDetectionThreshold(0.05);

        this.outlineEffect = new OutlineEffect(this.scene, this.camera, {
			blendFunction: BlendFunction.SCREEN,
			multisampling: Math.min(4, this.renderer.capabilities.maxSamples),
			edgeStrength: 15,
			pulseSpeed: 0.0,
            resolutionX: 1024,
            resolutionY: 1024,
			visibleEdgeColor: 0xffffff,
			hiddenEdgeColor: 0xffffff,
			height: 480,
			blur: false,
			xRay: true
		});

		const smaaPass = new EffectPass(this.camera, smaaEffect);
		const outlinePass = new EffectPass(this.camera, this.outlineEffect);

        const composer = new EffectComposer(this.renderer, {
            frameBufferType: HalfFloatType
        });
        composer.addPass(new RenderPass(this.scene, this.camera));
		composer.addPass(outlinePass);
		composer.addPass(smaaPass);
        this.composer = composer

        const cubeTextureLoader = new CubeTextureLoader().setPath('cube-map/');
        this.cubeTexture = await cubeTextureLoader.loadAsync(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
        this.scene.background = this.cubeTexture;

        const ambientLight = new AmbientLight(0xffffff, 2)

        const pointLight = new PointLight(0xffffff, 3)
        pointLight.position.set(10, 10, 10)
        pointLight.castShadow = true

        const pointLight2 = new PointLight(0xffffff, 3)
        pointLight2.position.set(-10, 10, 5)
        pointLight2.castShadow = true

        const pointLight3 = new PointLight(0xffffff, 3)
        pointLight3.position.set(-5, 10, 0)
        pointLight3.castShadow = true

        const directionalLight = new DirectionalLight(0xffffff, 3)
        directionalLight.position.set(-20, 20, 20)
        directionalLight.castShadow = true
        directionalLight.shadow.bias = -0.003
        directionalLight.shadow.mapSize.width = 2048
        directionalLight.shadow.mapSize.height = 2048
        directionalLight.shadow.camera.left = -2
        directionalLight.shadow.camera.right = 2
        directionalLight.shadow.camera.top = 2
        directionalLight.shadow.camera.bottom = -2
        directionalLight.shadow.camera.near = 0.1
        directionalLight.shadow.camera.far = 10

        this.scene.add(ambientLight, pointLight, pointLight2, pointLight3, directionalLight)

        await this.createMaterials(materials)

        this.cube = (await this.GLTFLoader.loadAsync('separated_cube_v1.glb')).scene

        this.scene.add(this.cube)
        for (let i = 0; i < 6; i++) {
            const face = this.cube.children[i] as Mesh
            face.receiveShadow = true
            face.castShadow = true
        }
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement)
        this.transformControls.attach(this.cube)
        this.transformControls.setMode('rotate')
        this.transformControls.addEventListener('mouseDown', () => {this.controls.enabled = false})
        this.transformControls.addEventListener('mouseUp', () => {this.controls.enabled = true})
        this.scene.add(this.transformControls.getHelper())

        this.renderer.setAnimationLoop(this.animation);
        this.resize();
        this.initialized = true
    }

    setState(s: CubeState) {
        if (!this.initialized) return

        for (let i = 0; i < 6; i++) {
            const face = this.cube.children[i] as Mesh
            const material = this.materials![s.materials[i].name]
            face.material = s.materials[i].type === MaterialType.PBR ? material.PBR : material.Phong
        } 
        const selection = isSomething(s.selectedFaceIndex) ? [this.cube.children[s.selectedFaceIndex]] : []
        this.outlineEffect.selection.set(selection)
    }

    private async createMaterials(materials: MaterialsData) {
        const textureLoader = new TextureLoader()
        for (const key in materials) {
            const materialData = materials[key as MaterialName]

            const [map, normalMap, metalnessMap, roughnessMap, aoMap, displacementMap] = await Promise.all([
                textureLoader.loadAsync(materialData.albedo),
                textureLoader.loadAsync(materialData.normal),
                textureLoader.loadAsync(materialData.metallic),
                textureLoader.loadAsync(materialData.roughness),
                materialData.ao ? textureLoader.loadAsync(materialData.ao) : null,
                materialData.height ? textureLoader.loadAsync(materialData.height) : null
            ])

            const materialPBR = new MeshStandardMaterial({
                map,
                normalMap,
                metalnessMap,
                metalness: 1,
                roughnessMap,
                aoMap,
                aoMapIntensity: 1,
                displacementMap,
                displacementScale: 0.1,
                envMap: this.cubeTexture,
                side: DoubleSide
            })

            const materialPhong = new MeshPhongMaterial({
                map,
                normalMap,
                aoMap,
                aoMapIntensity: 1,
                side: DoubleSide
            })

            this.materials![key as MaterialName] = {
                PBR: materialPBR,
                Phong: materialPhong,
            }
        }
    }

    onPointerdown(e: MouseEvent): number | undefined {
        const mouse = new Vector2((e.clientX / this.renderer.domElement.clientWidth) * 2 - 1, -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1)
        this.raycaster.setFromCamera(mouse, this.camera)
      
        const intersects = this.raycaster.intersectObjects(this.cube.children, false)
        if (intersects.length) {
            const index = this.cube.children.findIndex(e => e === intersects[0].object)
            return index
        } else {
            return undefined
        }
    }
    
    private animation = () => {
        if(!this.renderer.domElement.parentNode) return;
    
        this.controls.update()
        this.composer.render()
    }

    private resize = () => {
        const container = this.renderer.domElement.parentNode as HTMLDivElement;
    
        if(container) {
    
            const width = container.offsetWidth;
            const height = container.offsetHeight;
    
            this.composer.setSize( width, height );
    
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }

    dispose() {
        //resource cleaning code
    }
}