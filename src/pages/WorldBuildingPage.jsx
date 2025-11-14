// This becomes the hub for all world-building sections
export default function WorldBuildingPage() {
  return (
    <div className="worldbuilding-dashboard">
      <h1>World Building</h1>
      <div className="worldbuilding-grid">
        <Card title="Characters" icon="👤" to="/characters" count={24} />
        <Card title="Locations" icon="🏛️" to="/locations" count={12} />
        <Card title="Factions" icon="⚔️" to="/factions" count={8} />
        <Card title="Magic Systems" icon="✨" to="/magic-systems" count={3} />
        <Card title="Species" icon="🐲" to="/species" count={15} />
        <Card title="Timeline" icon="📅" to="/timeline" count={56} />
      </div>
    </div>
  );
}