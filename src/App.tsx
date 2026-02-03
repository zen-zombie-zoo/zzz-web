import React, { useState } from "react";
import { ResourcePanel } from "./ui/ResourcePanel";
import { ZooCanvas } from "./ui/ZooCanvas";
import { wipeSave } from "./game/save";
import { ZombieStore } from "./ui/ZombieStore";
import { Modal } from "./ui/Modal";
import { Tips } from "./ui/Tips";
import storeIcon from "./assets/store.svg";
import infoIcon from "./assets/info.svg";

const App: React.FC = () => {
  const [storeOpen, setStoreOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);

  return (
    <>
      {/* Top right UI */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 100,
          display: "flex",
          gap: 12,
          alignItems: "flex-start"
        }}
      >
        <button
          onClick={() => setTipsOpen(true)}
          style={{
            width: 48,
            height: 48,
            padding: 8,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Help & Tips"
        >
          <img src={infoIcon} alt="Info" width={28} height={28} />
        </button>

        <button
          onClick={() => setStoreOpen(true)}
          style={{
            width: 48,
            height: 48,
            padding: 8,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Store"
        >
          <img src={storeIcon} alt="Store" width={28} height={28} />
        </button>

        <div className="panel" style={{ minWidth: 180 }}>
          <ResourcePanel />
        </div>
      </div>

      {/* Store Modal */}
      <Modal open={storeOpen} onClose={() => setStoreOpen(false)} title="Zombie Store">
        <ZombieStore />
      </Modal>

      {/* Tips Modal */}
      <Modal open={tipsOpen} onClose={() => setTipsOpen(false)} title="Welcome to Zen Zombie Zoo!">
        <Tips />
      </Modal>

      {/* Zoo canvas */}
      <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
        <ZooCanvas width={800} height={800} />
      </div>

      {/* Bottom UI */}
      <div className="container">
        <h1>Zen Zombie Zoo</h1>
        <div style={{ marginTop: 16 }}>
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
    </>
  );
};

export default App;
