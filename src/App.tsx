import React, { useState } from "react";
import { ResourcePanel } from "./ui/ResourcePanel";
import { ZooCanvas } from "./ui/ZooCanvas";
import { wipeSave } from "./game/save";
import { Modal } from "./ui/Modal";
import { Tips } from "./ui/Tips";
import { MachineModal } from "./ui/MachineModal";
import infoIcon from "./assets/info.svg";

const App: React.FC = () => {
  const [tipsOpen, setTipsOpen] = useState(false);
  const [machineOpen, setMachineOpen] = useState(false);

  return (
    <>
      {/* Top right UI */}
      <div className="top-ui">
        <button onClick={() => setTipsOpen(true)} className="icon-button" title="Help & Tips">
          <img src={infoIcon} alt="Info" width={28} height={28} />
        </button>

        <div className="panel resource-panel-wrapper">
          <ResourcePanel />
        </div>
      </div>

      {/* Tips Modal */}
      <Modal open={tipsOpen} onClose={() => setTipsOpen(false)} title="Welcome to Zen Zombie Zoo!">
        <Tips />
      </Modal>

      {/* Machine Modal */}
      <Modal open={machineOpen} onClose={() => setMachineOpen(false)} title="Zombie Machine">
        <MachineModal />
      </Modal>

      {/* Zoo canvas */}
      <div className="canvas-wrapper">
        <ZooCanvas width={800} height={800} onMachineClick={() => setMachineOpen(true)} />
      </div>

      {/* Bottom UI */}
      <div className="container">
        <h1>Zen Zombie Zoo</h1>
        <div className="bottom-ui">
          <button
            onClick={() => {
              wipeSave();
              window.location.reload();
            }}
            className="clear-save-button"
          >
            Clear save
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
