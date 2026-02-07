import React from "react";
import "./Tips.css";

export const Tips: React.FC = () => {
  return (
    <div>
      <p className="small tips-intro">
        Grow your zombie collections to attract more zoo visitors and "earn" brains over time (in a totally legal way, of course). Use the brains to buy more zombies and
        unlock new types!
      </p>

      <h3 className="tips-heading">Tips</h3>
      <ul className="small tips-list">
        <li>Buy zombies to increase your brain production</li>
        <li>Each zombie type produces different amounts of brains per second</li>
        <li>New zombie types unlock as you earn more brains</li>
        <li>The game saves automatically every 5 seconds</li>
        <li>You earn offline progress when you return!</li>
      </ul>
    </div>
  );
};
