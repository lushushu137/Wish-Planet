import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Background from "./components/Background";
import Welcome from "./components/Welcome";
import Tutorial from "./components/Tutorial";
import GeneratePlanet from "./components/GeneratePlanet";
import Game from "./components/Game";
import { appState } from "./utilities";
import { Fade } from "@mui/material";
import caught from "./asset/music/caught.wav";
import useSound from "use-sound";

let gameLoop = -1;

function App() {
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

  const renderApp = () => {
    switch (state) {
      case appState.WELCOME:
        return <Welcome toNextState={changeAppState} />;
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
        <Background />
      </header>
    </div>
  );
}

export default App;
