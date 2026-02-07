import React, { useState } from "react";
import { Header } from "./ui/Header";
import { ZooCanvas } from "./ui/ZooCanvas";
import { Modal } from "./ui/Modal";
import { Tips } from "./ui/Tips";
import { MachineModal } from "./ui/MachineModal";
import { SettingsModal } from "./ui/SettingsModal";

const App: React.FC = () => {
  const [tipsOpen, setTipsOpen] = useState(false);
  const [machineOpen, setMachineOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="app">
      <Header
        onHelpClick={() => setTipsOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <main className="main-content">
        <ZooCanvas onMachineClick={() => setMachineOpen(true)} />
      </main>

      {/* Tips Modal */}
      <Modal open={tipsOpen} onClose={() => setTipsOpen(false)} title="How to Play">
        <Tips />
      </Modal>

      {/* Machine Modal */}
      <Modal open={machineOpen} onClose={() => setMachineOpen(false)} title="Zombieficator Machine">
        <MachineModal />
      </Modal>

      {/* Settings Modal */}
      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
        <SettingsModal />
      </Modal>
    </div>
  );
};

export default App;
