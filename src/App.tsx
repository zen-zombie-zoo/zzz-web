import React from 'react';
import { ResourcePanel } from './ui/ResourcePanel';
// import { AnimalStore } from './ui/AnimalStore';
import { ZooCanvas } from './ui/ZooCanvas';

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>🦓 Idle Zoo</h1>
      <p className="small">Earn cash from animals, expand your zoo, and watch it grow.</p>

      <div className="panel" style={{ marginTop: 16 }}>
        <ZooCanvas height={360} />
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="panel">
          <ResourcePanel />
        </div>

        {/*<div className="panel">*/}
        {/*  <AnimalStore />*/}
        {/*</div>*/}

        <div className="panel">
          <div>
            <h2>Tips</h2>
            <p className="small">
              Buy more animals to increase <strong>Revenue</strong>. New species unlock as you progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
