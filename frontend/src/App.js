import "./canvas/canvas.css"
import {Canvas} from "@react-three/fiber"
import {OrbitControls, Stars} from "@react-three/drei"

function App() {
  return (
    <>
      <Canvas>
        <ambientLight />
        <OrbitControls />
        <Stars />
      </Canvas>
    </>
  );
}

export default App;
