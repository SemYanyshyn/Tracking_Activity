function Tabs({ activeTab, onChange, tabs }) {
  return (
    <nav className="tab-nav" aria-label="Main sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? 'tab-button active' : 'tab-button'}
          aria-pressed={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default Tabs
