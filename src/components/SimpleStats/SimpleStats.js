import "./simplestats.css";
export default function SimpleStats() {
  return (
    <div className="simple-stats">
      <div className="stat">
        <span className="stat-metric">12</span>
        <span className="stat-name">Taluka</span>
      </div>
      <div className="stat">
        <span className="stat-metric">707</span>
        <span className="stat-name">Villages</span>
      </div>
      <div className="stat">
        <span className="stat-metric">2040</span>
        <span className="stat-name">Target</span>
      </div>
      <div className="stat">
        <span className="stat-metric">381</span>
        <span className="stat-name">Inaugrations</span>
      </div>
      <div className="stat">
        <span className="stat-metric">16</span>
        <span className="stat-name">Completed</span>
      </div>
    </div>
  );
}
