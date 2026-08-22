import { useState, useRef, useEffect } from 'react'
import { useStore, hasData } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { webauthnOK, passkeyLogin, passkeyRegister, api, BIO } from '../lib/api.js'
import { t } from '../lib/i18n.js'
import { DEMO, REPO } from '../lib/demo.js'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'
import MuscleHeatmapHero from '../components/MuscleHeatmapHero.jsx'

function RegisterSheet({ close }) {
  const { setUser, pushState, pullState } = useStore()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [inviteOnly, setInviteOnly] = useState(false)
  const ref = useRef(null)

  useEffect(() => { 
    setTimeout(() => ref.current?.focus(), 250) 
  }, [])

  useEffect(() => { 
    api('/api/config').then(c => setInviteOnly(!!c.invite_only)).catch(() => {}) 
  }, [])

  const go = async () => {
    const n = name.trim()
    if (!n) { useUI.getState().toast(t('Enter a name')); return }
    if (inviteOnly && !code.trim()) { useUI.getState().toast(t('An invite code is required')); return }
    try {
      const u = await passkeyRegister(n, code.trim())
      setUser(u)
      close()
      if (hasData(useStore.getState().S)) { 
        await pushState()
        useUI.getState().toast(t('Profile created — data synced')) 
      } else { 
        await pullState()
        useUI.getState().toast(t('Welcome, {0}', u.name)) 
      }
    } catch (e) { 
      if (e.name !== 'NotAllowedError' && e.name !== 'AbortError') {
        useUI.getState().toast(e.message || t('Registration failed')) 
      }
    }
  }

  return (
    <>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{t('Create athlete profile')}</h3>
      <div className="muted small" style={{ marginBottom: 16 }}>
        {t('Pick a username, then confirm with {0}. No passwords needed.', BIO)}
      </div>
      <input 
        ref={ref} 
        className="input" 
        placeholder={t('Your athlete name')} 
        maxLength={40} 
        value={name} 
        onChange={e => setName(e.target.value)} 
        style={{ borderRadius: 12, padding: '12px 14px' }}
      />
      {inviteOnly && (
        <>
          <div style={{ height: 12 }} />
          <input 
            className="input" 
            placeholder={t('Invite code')} 
            maxLength={40} 
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())} 
            style={{ letterSpacing: '.14em', fontWeight: 600, textAlign: 'center', borderRadius: 12 }} 
          />
          <div className="dim small" style={{ marginTop: 6 }}>{t('This instance is invite-only.')}</div>
        </>
      )}
      <div style={{ height: 16 }} />
      <Button variant="primary" onClick={go} style={{ width: '100%', padding: '14px', borderRadius: 12 }}>
        {t('Create passkey')}
      </Button>
    </>
  )
}

export default function Login() {
  const { setUser, pullState, setGuest } = useStore()

  const signIn = async () => {
    try { 
      const u = await passkeyLogin()
      setUser(u)
      await pullState()
      useUI.getState().toast(t('Welcome back, {0}', u.name)) 
    } catch (e) { 
      if (e.name !== 'NotAllowedError' && e.name !== 'AbortError') {
        useUI.getState().toast(e.message || t('Sign-in failed')) 
      }
    }
  }

  return (
    <div className="login-hub-centered">
      {/* Brand Header */}
      <div className="login-header-unified">
        <div className="login-badge-mini">
          <Icon name="sparkles" style={{ fontSize: 11 }} />
          <span>ARQ STRENGTH ENGINE</span>
        </div>
        <h1 className="login-title-unified">ARQ</h1>
        <div className="login-subtitle-unified">
          {t('Intelligent Strength Tracking & Analytics')}
        </div>
      </div>

      {/* Interactive Muscle Heatmap & Exercise Visualizer */}
      <MuscleHeatmapHero />

      {/* Action Hub */}
      <div className="login-actions-unified">
        <button 
          className="btn primary login-primary-btn" 
          onClick={() => setGuest(true)}
        >
          <Icon name="play" style={{ fontSize: 16 }} />
          <span>{t('Start Workout / Enter App')}</span>
        </button>

        {webauthnOK() && !DEMO ? (
          <div className="login-auth-row">
            <Button 
              variant="tinted" 
              icon="person" 
              onClick={signIn} 
              className="login-sub-btn"
            >
              {t('Sign In')}
            </Button>
            <Button 
              variant="tinted" 
              icon="plus"
              onClick={() => useUI.getState().openSheet(close => <RegisterSheet close={close} />)}
              className="login-sub-btn"
            >
              {t('New Profile')}
            </Button>
          </div>
        ) : null}

        {DEMO && (
          <div className="dim small" style={{ marginTop: 6, fontSize: 11 }}>
            <a href={REPO} target="_blank" rel="noopener" style={{ color: 'var(--acc)', textDecoration: 'none', fontWeight: 600 }}>
              {t('Self-host ARQ on your server →')}
            </a>
          </div>
        )}

        <div className="login-privacy-footer">
          <span>🔒 100% Private</span>
          <span>•</span>
          <span>⚡ Offline First</span>
          <span>•</span>
          <span>📊 Zero Tracking</span>
        </div>
      </div>
    </div>
  )
}