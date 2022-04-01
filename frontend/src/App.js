import "./canvas/canvas.css";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  shaderMaterial,
  Stats,
  useTexture,
} from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import backgroundImage from "./images/artboard.png";

const ExplosionMaterial = shaderMaterial(
  //Uniform
  {
    uTime: 0.0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(),
    uCreationTimer: 0.0,
    uPositionCords: [],
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
    #define PI 3.1415926535897932384626433832795

    precision mediump float;

    uniform float uTime;
    uniform sampler2D uTexture;
    uniform float uCreationTimer;
    uniform vec3 uPositionCords[200];

    varying vec2 vUv;

    float random(vec2 st)
    {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main(){

      float strengths[200];
      int newArrayLength = strengths.length();

      for( int i = 0; i < newArrayLength; i++)
      {
        // float stem = distance(vec2(vUv.x, (vUv.y - uPositionCords[i].y) * 4.0 + uPositionCords[i].y), vec2(uPositionCords[i].x, uPositionCords[i].y));

        

        

        float stem = (distance(vec2(vUv.x, (vUv.y - uPositionCords[i].y) * 4.0 + uPositionCords[i].y), vec2(uPositionCords[i].x, uPositionCords[i].y)));


        strengths[i] = stem / abs(uPositionCords[i].z);

        float randomPoint = random(vUv) ; 

        if( strengths[i] > 0.1 ){
          strengths[i] = 1.0;
        } else if( strengths[i] < randomPoint ){
          strengths[i] = 0.0; //this is the circle
        }
      }

      vec3 texture = (texture2D(uTexture, (vUv * 100.0)).rgb);
      for( int i = 0; i < newArrayLength; i++)
      {
        texture *= strengths[i];
      }

      if (texture.x == 0.0){
        texture.x = 1.0;
        texture.y = 1.0;
        texture.z = 1.0;
      }
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
  texture.repeat.set(100, 100);

  const [creationTimer, setCreationTimer] = useState(0);
  const [playGrow, setPlayGrow] = useState(false);
  const [playDecay, setPlayDecay] = useState(false);
  const [positionCord, setPositionCord] = useState(
    new THREE.Vector3(0.0, 0.0, 0.0)
  );
  const [positionCords, setPositionCords] = useState([
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
    positionCord,
  ]);

  useFrame(() => {
    positionCords.forEach((cord) => {
      if (cord.z < 0.2) {
        cord.z = 0;
      } else {
        cord.z -= 0.001;
      }
    });
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playGrow === true) {
        setCreationTimer(() => creationTimer + 0.1);
        positionCords[199].z += 0.1;
        if (creationTimer > 1) {
          setPlayDecay(true);
          setPlayGrow(false);
        }
      } else if (playDecay === true) {
        setCreationTimer((creationTimer) => creationTimer - 0.2);
        // positionCords.forEach((cord) => {
        //   console.log('cord', cord.z);
        //   // if (cord.z < 0.2) {
        //   //   cord.z = 0;
        //   // } else {
        //   //   cord.z -= 0.1;
        //   // }
        // });
        if (creationTimer < 0) {
          setPlayDecay(false);
        }
      }
      // console.log("Play decay", playDecay);
      // console.log("creation timer", creationTimer);
    }, 100);
    return () => clearInterval(intervalId);
  }, [playDecay, creationTimer, positionCords, positionCord, playGrow]);

  return (
    <>
      <mesh
        onPointerMove={(e) => {
          setCreationTimer(() =>
            creationTimer <= 0.8 ? creationTimer + 0.01 : 0.2
          );
          setPlayGrow(true);
          setPositionCord(new THREE.Vector3(e.uv.x, e.uv.y, creationTimer));
          setPositionCords([...positionCords.slice(1)]);
          setPositionCords((positionCords) => [...positionCords, positionCord]);
        }}
      >
        <planeBufferGeometry args={[20, 20]} />
        <explosionMaterial
          uTexture={texture}
          uCreationTimer={creationTimer}
          uPositionCords={positionCords}
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
          <BackgroundPlane />
          <Stats />
        </Canvas>
      </Suspense>
    </>
  );
}

export default App;
