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
    uAngleEnd: new THREE.Vector2(),
    uPositionCords: []
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
    uniform vec2 uCustomUv;
    uniform float uCreationTimer;
    uniform vec2 uAngleEnd;
    uniform vec2 uPositionCords[5];

    varying vec2 vUv;

    float random(vec2 st)
    {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    vec2 rotate(vec2 uv, float rotation, vec2 mid)
    {
      return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
      );
    }

    // float newAngle(){
    //   float angle;
    //   if(uAngleEnd.x > uCustomUv.x && uAngleEnd.y > uCustomUv.y ){
    //     angle = PI * + uCustomUv.x + uCustomUv.y;
    //   } else angle = PI * - uCustomUv.x + uCustomUv.y;
    //   return angle;
    // }

    void main(){

      float strength = distance(vUv, uCustomUv) ;

      float strengths[5];

      for( int i = 0; i < 5; i++)
      {
         strengths[i] = distance(vUv, vec2(uPositionCords[i].x, uPositionCords[i].y)) ;
        
        if( strengths[i] > 0.1){
          strengths[i] = 1.0;
        } else if( strengths[i] < 0.1){
          strengths[i] = 0.0; //this is the circle
        }
      }

      // float strength = distance(vec2((vUv.x - 0.5) * 0.5 + 0.5, (vUv.y - 0.5) * 0.8 + 0.5), vec2(0.5, 0.5)); 

      
      float angle = PI;

      vec2 rotatedUCustomUv = rotate(vUv, angle, uCustomUv);


      // float ellipse = distance(vec2(vUv.x, (vUv.y - uCustomUv.y) * 2.0 + uCustomUv.y), vec2((uCustomUv.x), uCustomUv.y));

      // float stem = distance( vec2((rotatedUCustomUv.x - uCustomUv.x) * 5.0 + uCustomUv.x, (rotatedUCustomUv.y - 0.35)), vec2((uCustomUv.x), uCustomUv.y));


      // float strength = ellipse * stem / uCreationTimer;

      float randomPoint = random(vUv) * 0.1;  

      if( strength > randomPoint){
        strength = 1.0;
      } else if( strength < randomPoint){
        strength = 0.0; //this is the circle
      }


      int newArrayLength = strengths.length();
      vec3 texture = (texture2D(uTexture, (vUv * 50.0)).rgb);
      for( int i = 0; i < newArrayLength; i++)
      {
        texture *= strengths[i];
      }

      // vec3 texture = (texture2D(uTexture, (vUv * 50.0)).rgb) * strength * strengthTwo * strengthThree * strengthFour * strengthFive;

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
  const [angleEnd, setAngleEnd] = useState(1);
  // const [ positionCords, setPositionCords] = useState([0.2, 0.2, 0.4, 0.4, 0.6, 0.6, 0.8, 0.8, 1.0, 1.0])

  const positionTest = new THREE.Vector2(0.5, 0.5)

  const [ positionCords, setPositionCords] = useState([positionTest, positionTest, positionTest, positionTest, positionTest])


  useEffect(() => {
    if (playDecay === true) {
      const intervalId = setInterval(() => {
        if (creationTimer < 0.1) {
          setPlayDecay(false);
        } else {
          setCreationTimer((creationTimer) => creationTimer - 0.1);
        }
        // console.log("decay timer", creationTimer);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [playDecay, creationTimer, positionCords]);


  return (
    <>
      <mesh
        onPointerMove={(e) => {
          // (customUv = e.uv)
          // console.log('mouse direction', e);
          setCreationTimer(() => creationTimer + 0.01);
          setAngleEnd(ref.current.uCustomUv);
          ref.current.uCustomUv = e.uv;
          setPlayCreation(true);
          setPositionCords([...positionCords.slice(1)])
          setPositionCords( positionCords => [...positionCords, e.uv] )
          // setPositionCords( positionCords => [...positionCords, e.uv.x, e.uv.y] )
        }}
        onAfterRender={() => {
          setPlayDecay(true)
          
        }}

        onClick={ (e) => {
          
          
          console.log('position cord', positionCords);
          
        }
        }
      >
        <planeBufferGeometry args={[5, 5, 50, 50]} />
        <explosionMaterial
          ref={ref}
          uAngleEnd={angleEnd}
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
