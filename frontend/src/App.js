import "./canvas/canvas.css";
import { Canvas, extend } from "@react-three/fiber";
import { shaderMaterial, Stats, useTexture } from "@react-three/drei";
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
    uniform vec3 uPositionCords[50];

    varying vec2 vUv;

    float random(vec2 st)
    {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // vec2 rotate(vec2 uv, float rotation, vec2 mid)
    // {
    //   return vec2(
    //     cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    //     cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    //   );
    // }

    void main(){

      float strengths[50];
      
      //ellipse
      // strengths[49] = (distance(vec2(vUv.x, vUv.y), vec2(uPositionCords[49].x, uPositionCords[49].y)) / uCreationTimer) * 0.5;


      // // float randomPoint = random(vUv) * 0.1;

      // if( strengths[49] > 0.1){
      //   strengths[49] = 1.0;
      // } else if( strengths[49] < 0.1){
      //   strengths[49] = 0.0; //this is the circle
      // }
      // for( int i = 0; i < 49; i++)
      for( int i = 0; i < 50; i++)
      {
        // vec2 rotatedUCustomUv = rotate(vUv, PI , uPositionCords[i]);
        float stem = distance(vec2(vUv.x, (vUv.y - uPositionCords[i].y) * 2.0 + uPositionCords[i].y), vec2(uPositionCords[i].x, uPositionCords[i].y));

        strengths[i] = stem / uPositionCords[i].z;

        // strengths[i] = stem ;


        if( strengths[i] > 0.1){
          strengths[i] = 1.0;
        } else if( strengths[i] < 0.1){
          strengths[i] = 0.0; //this is the circle
        }
      }

      int newArrayLength = strengths.length();
      vec3 texture = (texture2D(uTexture, (vUv * 50.0)).rgb);
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
  texture.repeat.set(50, 50);

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
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playGrow === true && creationTimer < 1) {
        setCreationTimer(() => creationTimer + 0.1);
        positionCords[49].z += 0.1
        // positionCords.forEach((cord) => {
        //   cord.z += 0.1;
        //   // console.log("cord z", cord.z);
        // });
      } else if (creationTimer > 1) {
        setPlayDecay(true);
        setPlayGrow(false);
      }
      if (playDecay === true) {
        // if (creationTimer < 0.1) {
          // setCreationTimer(0);
          // setPositionCords(() => [
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          //   positionCord,
          // ]);
          // setPlayDecay(false);
        // } else {
          // setCreationTimer((creationTimer) => creationTimer - 0.1);
          // positionCords.forEach((cord) => {
          //   if (cord.z < 0.1) {
          //     cord.z = 0;
          //   } else {
          //     cord.z -= 0.1;
          //   }
          //   // console.log("cord z", cord.z);
          // });
          if( creationTimer > 0.1){
          setCreationTimer((creationTimer) => creationTimer - 0.1);
          positionCords.forEach((cord) => {
            if (cord.z < 0.1) {
              cord.z = 0;
            } else {
              cord.z -= 0.1;
            }
            // console.log("cord z", cord.z);
          });
        } else if (creationTimer <= 0.1) {
          setPlayDecay(false)
          setCreationTimer(0)
        }
        // }
      }
      console.log("creation timer", creationTimer);
      // console.log("playgrow", playGrow);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [playDecay, creationTimer, positionCords, positionCord, playGrow]);

  return (
    <>
      <mesh
        onPointerMove={(e) => {
          setCreationTimer(() => creationTimer <= 1 ? creationTimer + 0.01 : creationTimer);
          setPlayGrow(true);
          setPositionCord(new THREE.Vector3(e.uv.x, e.uv.y, creationTimer));
          setPositionCords([...positionCords.slice(1)]);
          setPositionCords((positionCords) => [...positionCords, positionCord]);
        }}
        onAfterRender={(e) => {
          // setPlayGrow(true)
          // setPlayDecay(true);
        }}
      >
        <planeBufferGeometry args={[5, 5, 50, 50]} />
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
          {/* <OrbitControls /> */}
          <BackgroundPlane />
          <Stats />
        </Canvas>
      </Suspense>
    </>
  );
}

export default App;
