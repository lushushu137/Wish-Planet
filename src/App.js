import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Background from "./components/Background";
import Welcome from "./components/Welcome";
import Tutorial from "./components/Tutorial";
import GeneratePlanet from "./components/GeneratePlanet";
import PlanetCard from "./components/PlanetCard";
import Game from "./components/Game";
import { appState } from "./utilities";

function App() {
  const [state, setState] = useState(appState.WELCOME);
  const [screenShot, setScreenShot] = useState("");

  const changeAppState = (state) => {
    setState(state);
  };

  const saveScreenShot = (url) => {
    setScreenShot(url);
  };

  const renderApp = () => {
    switch (state) {
      case appState.WELCOME:
        return <Welcome toNextState={changeAppState} />;
      case appState.TUTORIAL:
        return <Tutorial toNextState={changeAppState} />;
      case appState.GAMING:
        return (
          <>
            <Game toNextState={changeAppState} />
          </>
        );
      case appState.GENERATING:
        return (
          <GeneratePlanet
            toNextState={changeAppState}
            saveScreenShot={saveScreenShot}
          />
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
