import './assets/scss/index.scss';
import { Canvas } from "./components";

export const App = () => {
  
  return (
    <div className="slideshow">
      <header className="slideshow-header">
        <h1> Frontend Code Challenge</h1>
      </header>
      <main className="example">
        <Canvas />
        <aside>Drag to change image</aside>
      </main>

    </div>
  );
}

export default App;
