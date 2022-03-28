import logo from "./logo.svg";
import "./App.css";
import Background from "./components/Background";
import ShootingStar from "./components/ShootingStar";

import Video from "./components/Video";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Video />
        <ShootingStar />
        <Background />
      </header>
    </div>
  );
}

export default App;
