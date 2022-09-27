
function App() {

  return (
    <div className="slideshow">
      <header className="slideshow-header">
        <h1> Frontend Code Challenge</h1>
      </header>
      <main id="example">
          <canvas id="image_slider" width={640} height={480} ></canvas>
          <aside>Drag to change image</aside>
      </main>

    </div>
  );
}

export default App;
