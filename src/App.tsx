import React, { useState, useEffect } from "react";
import { Header } from "./ui/Header";
import { ZooCanvas } from "./ui/ZooCanvas";
import { Modal } from "./ui/Modal";
import { Tips } from "./ui/Tips";
import { MachineModal } from "./ui/MachineModal";
import { SettingsModal } from "./ui/SettingsModal";
import { EarlyAccessModal } from "./ui/EarlyAccessModal";

const EARLY_ACCESS_KEY = "zzz_early_access_seen";

const App: React.FC = () => {
  const [tipsOpen, setTipsOpen] = useState(false);
  const [machineOpen, setMachineOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);

  useEffect(() => {
    const hasSeenEarlyAccess = localStorage.getItem(EARLY_ACCESS_KEY);
    if (!hasSeenEarlyAccess) {
      setEarlyAccessOpen(true);
    }
  }, []);

  const handleEarlyAccessClose = () => {
    localStorage.setItem(EARLY_ACCESS_KEY, "true");
    setEarlyAccessOpen(false);
  };

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

      {/* Early Access Modal */}
      <Modal open={earlyAccessOpen} onClose={handleEarlyAccessClose} title="Early Access">
        <EarlyAccessModal onClose={handleEarlyAccessClose} />
      </Modal>
    </div>
  );
};

export default App;
