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

    float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

    void main(){

      // float strength = distance(vUv, uCustomUv) / uCreationTimer;

      // float strength = distance(vUv, uCustomUv) / uCreationTimer;

      // float strength = distance(vec2((vUv.x - 0.5) * 0.5 + 0.5, (vUv.y - 0.5) * 0.8 + 0.5), vec2(0.5, 0.5));

      float ellipse = distance(vec2(vUv.x, (vUv.y - 0.5) * 2.0 + 0.5), vec2(0.5));
      float stem = distance(vec2((vUv.x - 0.5) * 5.0 + 0.5, (vUv.y + 0.25 )), vec2(0.5));

      float strength = ellipse * stem / uCreationTimer;

      float randomPoint = random(vUv) * 0.1;  

      if( strength > randomPoint){
        strength = 1.0;
      } else if( strength < randomPoint){
        strength = 0.0; //this is the circle
      }

      vec3 texture = (texture2D(uTexture, (vUv * 50.0)).rgb) * strength;

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

  const [creationTimer, setCreationTimer] = useState(0);
  const [playCreation, setPlayCreation] = useState(false);
  const [playDecay, setPlayDecay] = useState(false);

  useEffect(() => {
    if (playCreation === true) {
      const intervalId = setInterval(() => {
        if (creationTimer > 3) {
          setPlayCreation(false)
          setPlayDecay(true)
        } else {
          setCreationTimer((creationTimer) => creationTimer + 1);
        }
        console.log("creation timer", creationTimer);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (playDecay === true) {
      const intervalId = setInterval(() => {
        if (creationTimer < 1) {
          setPlayDecay(false);
        } else {
          setCreationTimer((creationTimer) => creationTimer - 1);
        }
        console.log("decay timer", creationTimer);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [playCreation, creationTimer, playDecay]);

  return (
    <>
      <mesh
        onPointerMove={(e) => {
          // (customUv = e.uv)
          ref.current.uCustomUv = e.uv;
          setPlayCreation(true)
        }}
        // onPointerDown={() => {
        //   setPlayCreation(true);
        //   setPlayDecay(false);
        // }}
        // onPointerUp={() => {
        //   setPlayCreation(false);
        //   setPlayDecay(true);
        // }}
      >
        <planeBufferGeometry args={[5, 5, 50, 50]} />
        <explosionMaterial
          ref={ref}
          uTexture={texture}
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
