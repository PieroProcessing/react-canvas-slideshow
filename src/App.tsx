import { useCallback, useEffect, useState } from "react";

export const App = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const onRefCanvas = useCallback( (node: HTMLCanvasElement) => setCanvas(node), [])
  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
  }, [canvas])
  return (
    <div className="slideshow">
      <header className="slideshow-header">
        <h1> Frontend Code Challenge</h1>
      </header>
      <main id="example">
        <canvas ref={onRefCanvas} id="image_slider" width={640} height={480} ></canvas>
        <aside>Drag to change image</aside>
      </main>

    </div>
  );
}

export default App;
