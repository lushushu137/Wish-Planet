import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Background from "./components/Background";
import ShootingStar from "./components/ShootingStar";
import Video from "./components/Video";
import { catchStatus } from "./utilities";
function App() {
  const [shooting, setShooting] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(0);
  const [currentState, setCurrentState] = useState(catchStatus.WAITING);
  const changeShooting = (isShooting) => {
    setShooting(isShooting);
  };

  const changeCurrentDirection = (dir) => {
    setCurrentDirection(dir);
  };

  const changeCurrentState = (state) => {
    setCurrentState(state);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Video
          shooting={shooting}
          setDirection={changeCurrentDirection}
          setCatchStatus={changeCurrentState}
        />
        <ShootingStar
          setShooting={changeShooting}
          direction={currentDirection}
          currentState={currentState}
        />
        <Background />
      </header>
    </div>
  );
}

export default App;
