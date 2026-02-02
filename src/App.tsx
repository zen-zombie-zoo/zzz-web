import React from "react";
import { ResourcePanel } from "./ui/ResourcePanel";
import { ZooCanvas } from "./ui/ZooCanvas";
import { wipeSave } from "./game/save";
import { AnimalStore } from "./ui/AnimalStore";

const App: React.FC = () => {
  return (
    <>
      <div
        className="panel"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 100,
          minWidth: 180,
        }}
      >
        <ResourcePanel />
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
        <ZooCanvas width={800} height={800} />
      </div>

      <div className="container">
        <h1>🦓 Idle Zoo</h1>
        <p className="small">
          Earn cash from animals, expand your zoo, and watch it grow.
        </p>

        <div className="grid" style={{ marginTop: 16 }}>
          <div className="panel">
            <AnimalStore />
          </div>
          <div className="panel">
            <div>
              <h2>Tips</h2>
              <p className="small">
                Buy more animals to increase <strong>Revenue</strong>. New
                species unlock as you progress.
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                wipeSave();
                window.location.reload();
              }}
              style={{ width: "100px", height: "50px" }}
            >
              Clear save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
