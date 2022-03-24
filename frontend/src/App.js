import "./canvas/canvas.css";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  shaderMaterial,
  Stats,
  useTexture,
} from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import backgroundImage from "./images/artboard.png";

const ExplosionMaterial = shaderMaterial(
  //Uniform
  {
    uTime: 0.0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(),
    uCustomUv: new THREE.Vector2(),
    uCreationTimer: 0.0,
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
    uniform float uCreationTimer;

    varying vec2 vUv;

    void main(){

      float strength = distance(vUv, uCustomUv) / uCreationTimer;

      if( strength > 0.1){
        strength = 1.0;
      } else if( strength < 0.1){
        strength = 0.0; //this is the circle
      }
      vec3 texture = (texture2D(uTexture, (vUv * 50.0)).rgb) * strength ;

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
  texture.repeat.set(50, 50);

  const ref = useRef();

  // let customUv = new THREE.Vector2(1, 1);

  const [creationTimer, setCreationTimer] = useState(0);

  // let creationTimer = 1;

  useFrame(({ clock }) => {
    ref.current.uTime = clock.getElapsedTime();
    // ref.current.uCustomUv = customUv;
    ref.current.uCreationTimer = creationTimer;
  });

  useEffect(() => {
    console.log("explosion material", ref.current);
    // ref.current.transparent = true
    // ref.current.wireframe = true
  }, []);

  const [playCreation, setPlayCreation] = useState(false)

  useEffect(() => {
    if ( playCreation === true){
      const intervalId = setInterval(() => {
        if (creationTimer > 3) {
          // creationTimer = 1;
          setCreationTimer(0)
        } else {
          // creationTimer += 1;
          setCreationTimer( ( creationTimer) => creationTimer + 1)
        }
        console.log("timer", creationTimer);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [playCreation, creationTimer]);

  return (
    <>
      <mesh
        onPointerMove={(e) => {
          // (customUv = e.uv)
          ref.current.uCustomUv = e.uv;
        }}
        onPointerDown={ () => {
          setPlayCreation(true)
        }}
        onPointerUp={ () => {
          setPlayCreation(false)
        }}
        // onClick={() => {
          
        // }}
      >
        <planeBufferGeometry args={[5, 5, 50, 50]} />
        <explosionMaterial
          ref={ref}
          uTexture={texture}
          // uVisible={visible}
          uCreationTimer={creationTimer}
        />
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
          {/* <OrbitControls /> */}
          <BackgroundPlane />
          <Stats />
        </Canvas>
      </Suspense>
    </>
  );
}

export default App;
