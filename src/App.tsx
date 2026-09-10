import { Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import Visualizer from "./components/Visualizer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/visualizer" element={<Visualizer />} />
    </Routes>
  );
}
export default App;