import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import {
  Float,
  MeshReflectorMaterial,
  Sparkles,
  useTexture,
  Environment,
  ContactShadows,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import * as THREE from 'three'

/* ── PBR materials (singleton) ────────────────────────────────────── */
const bodyMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#1a1a1c'),
  roughness: 0.22,
  metalness: 0.88,
})
const metalMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#7c7c90'),
  roughness: 0.06,
  metalness: 0.98,
  envMapIntensity: 2.5,
})
const accentMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#9FDDEA'),
  roughness: 0.16,
  metalness: 0.45,
  emissive: new THREE.Color('#3ab8d0'),
  emissiveIntensity: 1.1,
})

/* ── White-key shader for PNG fallback ────────────────────────────── */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(uTexture, vUv);
    float w = min(c.r, min(c.g, c.b));
    float alpha = 1.0 - smoothstep(0.80, 0.95, w);
    vec3 grey = vec3(dot(c.rgb, vec3(0.299, 0.587, 0.114)));
    vec3 saturated = mix(grey, c.rgb, 1.3);
    gl_FragColor = vec4(saturated, alpha);
  }
`

/* ── 3D Stash model ───────────────────────────────────────────────── */
function StashModel() {
  const groupRef = useRef()
  const obj = useLoader(OBJLoader, '/models/vmoto_stash_concept.obj')

  const scene = useMemo(() => {
    const clone = obj.clone(true)
    clone.traverse((child) => {
      if (!child.isMesh) return
      const name = (child.parent?.name || '').toLowerCase()
      if (name.includes('tank')) {
        child.material = accentMat
      } else if (
        name.includes('fork') ||
        name.includes('swingarm') ||
        name.includes('motor')
      ) {
        child.material = metalMat
      } else if (name.includes('wheel')) {
        child.material = metalMat.clone()
        child.material.color.set('#222228')
        child.material.roughness = 0.12
        child.material.metalness = 0.96
      } else {
        child.material = bodyMat
      }
      child.castShadow = true
      child.receiveShadow = true
    })
    return clone
  }, [obj])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18
    }
  })

  return (
    /* The OBJ is Z-up so rotate -90° on X to make it Y-up (Three.js default).
       After that the bike bottom sits at Y=0, height extends to ~Y=1.8.
       Shift down so wheels sit on the reflective floor. */
    <group ref={groupRef} position={[0, -0.9, 0]}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

/* ── PNG fallback for non-Stash models ───────────────────────────── */
function BikeMesh({ url }) {
  const texture = useTexture(url)
  const matRef = useRef()

  const uniforms = useMemo(() => ({ uTexture: { value: texture } }), [])

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    if (matRef.current) matRef.current.uniforms.uTexture.value = texture
  }, [texture])

  return (
    <Float speed={1.4} rotationIntensity={0.02} floatIntensity={0.22}>
      <mesh position={[0.1, 0.4, 0]} rotation={[0.03, 0, 0]}>
        <planeGeometry args={[5.2, 3.1]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  )
}

/* ── Pulsing rim lights ────────────────────────────────────────────── */
function RimLights({ is3D }) {
  const blueRef = useRef()
  const fillRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (blueRef.current) blueRef.current.intensity = (is3D ? 18 : 10) + Math.sin(t * 1.2) * 2
    if (fillRef.current) fillRef.current.intensity = (is3D ? 6 : 4) + Math.sin(t * 1.8 + 1) * 1
  })

  return (
    <>
      {/* Strong key light — top front */}
      <directionalLight
        position={[-2, 4, 3]}
        intensity={is3D ? 2.8 : 1.2}
        color="#ffffff"
        castShadow={is3D}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-2}
      />
      {/* Blue rim — back right */}
      <pointLight ref={blueRef} position={[4, 2.5, -2]} color="#9FDDEA" intensity={18} />
      {/* Fill — front left low */}
      <pointLight ref={fillRef} position={[-3, -0.5, 3]} color="#6BCBDE" intensity={6} />
      {/* Under-glow */}
      <pointLight position={[0, -1, 1]} color="#9FDDEA" intensity={is3D ? 4 : 2} />
      {/* Ambient */}
      <ambientLight intensity={is3D ? 0.12 : 0.06} color="#9FDDEA" />
    </>
  )
}

/* ── Reflective floor ─────────────────────────────────────────────── */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.92, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        blur={[500, 100]}
        resolution={512}
        mixBlur={0.95}
        mixStrength={80}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#020202"
        metalness={0.7}
        mirror={0}
      />
    </mesh>
  )
}

/* ── Ground grid ──────────────────────────────────────────────────── */
function GroundGrid() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const verts = []
    const size = 14, step = 1.5
    for (let i = -size; i <= size; i += step) {
      verts.push(i, -0.9, -size, i, -0.9, size)
      verts.push(-size, -0.9, i, size, -0.9, i)
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return g
  }, [])

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#9FDDEA" transparent opacity={0.035} />
    </lineSegments>
  )
}

/* ── Camera drift animation ────────────────────────────────────────── */
function CameraDrift({ is3D }) {
  const { camera } = useRef(null)
  const t = useRef(0)
  const camRef = useRef()

  useFrame(({ camera: cam }, delta) => {
    t.current += delta * (is3D ? 0.08 : 0.12)
    if (is3D) {
      cam.position.x = Math.sin(t.current * 0.6) * 0.6 - 0.5
      cam.position.y = 0.9 + Math.sin(t.current * 0.4) * 0.2
      cam.position.z = 6.2 + Math.sin(t.current * 0.3) * 0.3
      cam.lookAt(0, 0.2, 0)
    } else {
      cam.position.x = Math.sin(t.current) * 0.4
      cam.position.y = 1.3 + Math.sin(t.current * 0.7) * 0.12
      cam.lookAt(0.1, 0.4, 0)
    }
  })
  return null
}

/* ── Main export ──────────────────────────────────────────────────── */
export default function HeroScene({ modelId, imageUrl }) {
  const is3D = modelId === 'stash'

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      shadows={is3D}
      camera={
        is3D
          ? { position: [-0.5, 0.9, 6.2], fov: 38 }
          : { position: [0, 1.3, 5.8], fov: 42 }
      }
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 12, 26]} />

      <Suspense fallback={null}>
        <RimLights is3D={is3D} />

        {is3D ? (
          <>
            <StashModel />
            <ContactShadows
              position={[0, -0.91, 0]}
              blur={2.5}
              far={3}
              opacity={0.9}
              color="#000000"
              scale={8}
            />
            <Environment preset="studio" environmentIntensity={0.4} />
          </>
        ) : (
          <BikeMesh url={imageUrl} />
        )}

        <Floor />
        <GroundGrid />

        <Sparkles
          count={is3D ? 50 : 70}
          scale={[12, 7, 6]}
          position={[0, 0.5, -1]}
          size={[0.3, 1.0]}
          speed={0.12}
          color="#9FDDEA"
          opacity={0.2}
          noise={0.25}
        />

        <EffectComposer>
          <Bloom
            intensity={is3D ? 2.2 : 1.4}
            luminanceThreshold={0.05}
            luminanceSmoothing={0.8}
            radius={0.85}
          />
          <Vignette offset={0.06} darkness={0.8} />
        </EffectComposer>
      </Suspense>

      <CameraDrift is3D={is3D} />
    </Canvas>
  )
}
