import guide3 from "./asset/pic/guide3.png";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import Background from "./components/Background";
import Welcome from "./components/Welcome";
import Tutorial from "./components/Tutorial";
import GeneratePlanet from "./components/GeneratePlanet";
import Game from "./components/Game";
import { appState, CATCH_STATUS } from "./utilities";
import { Fade } from "@mui/material";
import caught from "./asset/music/caught.wav";
import useSound from "use-sound";

let gameLoop = -1;

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [catchState, setCatchState] = useState(undefined);
  const [direction, setDirection] = useState(0); // increase or decrease

  const [state, setState] = useState(appState.WELCOME);
  const [starData, setStarData] = useState(undefined);
  const [playCaughtSound] = useSound(caught);

  const changeAppState = (state) => {
    if (state == appState.GAMING) {
      gameLoop += 1;
    }
    setState(state);
  };

  const saveStar = (url) => {
    setStarData(url);
  };

  const playSound = (sound) => {
    if (sound == "caughtSound") {
      playCaughtSound();
    }
  };

  const handleSetCatchState = (state) => {
    setCatchState(state);
  };

  const handlSetDirection = (dir) => {
    setDirection(dir);
  };
  const renderApp = () => {
    switch (state) {
      case appState.WELCOME:
        return (
          <Welcome
            toNextState={changeAppState}
            videoRef={videoRef}
            setDirection={handlSetDirection}
          />
        );
      case appState.TUTORIAL:
        return <Tutorial toNextState={changeAppState} />;
      case appState.GAMING:
        return (
          <Game
            toNextState={changeAppState}
            newStarData={starData}
            clearNewStar={saveStar}
            playSound={playSound}
            gameLoop={gameLoop}
            direction={direction}
            setCatchStatus={handleSetCatchState}
          />
        );
      case appState.GENERATING:
        return (
          <GeneratePlanet toNextState={changeAppState} saveStar={saveStar} />
        );
      // case appState.CHECKPlANET:
      //   return <PlanetCard />;
      default:
        break;
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        {renderApp()}
        <div className="videoAndCanvas">
          <Fade
            in={
              catchState !== CATCH_STATUS.SHOW_LAST_STAR &&
              state == appState.GAMING
            }
            timeout={1000}
          >
            <video
              ref={videoRef}
              className="video"
              width={400}
              height={300}
              style={{
                opacity:
                  catchState == CATCH_STATUS.SHOW_LAST_STAR ||
                  state !== appState.GAMING
                    ? 0
                    : 1,
              }}
            />
          </Fade>

          <Fade in={catchState == CATCH_STATUS.CATCHING} timeout={1000}>
            <img className="guide" src={guide3} />
          </Fade>
        </div>
        <Background />
      </header>
    </div>
  );
}

export default App;
