import "./canvas/canvas.css";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  shaderMaterial,
  Stats,
  useTexture,
} from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import backgroundImage from "./images/artboard.png";
// import { LinearMipMapLinearFilter, NearestFilter, RepeatWrapping } from "three";

const ExplosionMaterial = shaderMaterial(
  //Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(),
    uCustomUv: new THREE.Vector2()
  },
  // Vertex Shader
  glsl`

  varying vec2 vUv;

    void main(){

      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec2 uCustomUv;

    varying vec2 vUv;

    void main(){
      float strength = distance(sin(vUv + uTime), vec2(0.5));

      // float strength = distance(uCustomUv, vec2(0.5));


      if( strength > 0.1){
        strength = 1.0;
      } else if( strength < 0.1){
        strength = 0.0;
      }

      vec3 texture = (texture2D(uTexture, (vUv * 10.0)).rgb) * strength ;

      gl_FragColor = vec4(texture, 1.0);
    }
  `
);

extend({ ExplosionMaterial });

function BackgroundPlane() {

  const texture = useTexture(backgroundImage);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);

  const ref = useRef();

  let customUv = new THREE.Vector2(1, 1)

  useFrame(({ clock }) => {
    ref.current.uTime = clock.getElapsedTime();
    ref.current.uCustomUv = customUv
  });

  useEffect(() => {
    console.log("explosion material", ref.current);
    // ref.current.transparent = true
    // ref.current.wireframe = true
  }, []);

  

  return (
    <>
      <mesh 
      onPointerMove={(e) => {
        customUv = e.uv 
        console.log('custom', ref.current.uCustomUv)}}
        >
        <planeBufferGeometry args={[5, 5, 10, 10]} />
        <explosionMaterial ref={ref} uTexture={texture} />
      </mesh>
    </>
  );
}

function App() {
  return (
    <>
      <Suspense fallback={null}>
        <Canvas>
          <ambientLight />
          <OrbitControls />
          <BackgroundPlane />
          <Stats />
        </Canvas>
      </Suspense>
    </>
  );
}

export default App;
