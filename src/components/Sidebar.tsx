interface SidebarProps {
  activeNav: string
  onNavChange: (nav: string) => void
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⫶</span>
          <span className="logo-text">templafy</span>
        </div>
        <span className="dropdown-arrow">⌄</span>
      </div>

      <nav className="nav">
        <button
          className={`nav-item ${activeNav === 'create' ? 'active' : ''}`}
          onClick={() => onNavChange('create')}
        >
          <span className="nav-icon">✦</span>
          Create
        </button>
        <button
          className={`nav-item ${activeNav === 'browse' ? 'active' : ''}`}
          onClick={() => onNavChange('browse')}
        >
          <span className="nav-icon">⊞</span>
          Browse
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <span className="nav-icon">⊙</span>
          Profile & settings
        </button>
      </div>
    </aside>
  )
}
