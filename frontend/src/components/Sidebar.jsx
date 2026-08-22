import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { t } from '../lib/i18n.js'
import Icon from './Icon.jsx'

export default function Sidebar({ onStart }) {
  const nav = useNavigate()
  const loc = useLocation()
  const S = useStore(s => s.S)
  const user = useStore(s => s.user)

  const items = [
    { path: '/home', icon: 'home', label: t('Home') },
    { path: '/plan', icon: 'calendar', label: t('Training Plan') },
    { path: '/stats', icon: 'chart', label: t('Analytics') },
    { path: '/library', icon: 'dumbbell', label: t('Exercises') },
    { path: '/history', icon: 'history', label: t('Workout History') },
    { path: '/settings', icon: 'gear', label: t('Settings') },
  ]

  const cur = loc.pathname

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand" onClick={() => nav('/home')}>
        <div className="sidebar-logo">ARQ</div>
        <div>
          <div className="sidebar-title">ARQ</div>
          <div className="sidebar-subtitle">STRENGTH SUITE</div>
        </div>
      </div>

      {/* Quick Action Workout Button */}
      <div className="sidebar-action">
        <button
          className={'btn primary sidebar-start-btn' + (S.active ? ' active-session' : '')}
          onClick={S.active ? () => nav('/workout') : onStart}
        >
          <Icon name={S.active ? 'timer' : 'play'} />
          <span>{S.active ? t('In Progress') : t('Start Workout')}</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {items.map(item => {
          const on = cur === item.path || (item.path !== '/home' && cur.startsWith(item.path))
          return (
            <button
              key={item.path}
              className={'sidebar-nav-item' + (on ? ' on' : '')}
              onClick={() => nav(item.path)}
            >
              <span className="sidebar-nav-icon">
                <Icon name={item.icon} />
              </span>
              <span className="sidebar-nav-label">{item.label}</span>
              {on && <span className="sidebar-active-indicator" />}
            </button>
          )
        })}
      </nav>

      {/* Profile Footer */}
      <div className="sidebar-footer" onClick={() => nav('/settings')}>
        <div className="sidebar-avatar">
          {user ? user.name.slice(0, 2).toUpperCase() : 'ARQ'}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user ? user.name : t('Guest Athlete')}</div>
          <div className="sidebar-user-status">
            {user ? t('Passkey Synced') : t('Local Device Vault')}
          </div>
        </div>
        <Icon name="chevronRight" className="sidebar-user-arrow" />
      </div>
    </aside>
  )
}
