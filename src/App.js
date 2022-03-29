import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Background from "./components/Background";
import ShootingStar from "./components/ShootingStar";
import Video from "./components/Video";

function App() {
  const [shooting, setShooting] = useState(false);
  const switchShooting = (isShooting) => {
    setShooting(isShooting);
  };
  return (
    <div className="App">
      <header className="App-header">
        <Video shooting={shooting} />
        <ShootingStar setShooting={switchShooting} />
        <Background />
      </header>
    </div>
  );
}

export default App;
