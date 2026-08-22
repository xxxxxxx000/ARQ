import { useState, useEffect } from 'react'
import Icon from './Icon.jsx'
import { t } from '../lib/i18n.js'
import { useUI } from '../store/useUI.js'

let deferredPrompt = null

export function triggerPWAInstall(onDone) {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        deferredPrompt = null
        if (onDone) onDone(true)
      } else {
        if (onDone) onDone(false)
      }
    })
  } else {
    // iOS Safari or browser without beforeinstallprompt
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    useUI.getState().openSheet(close => (
      <div style={{ padding: '8px 4px 16px' }}>
        <div className="row" style={{ gap: 12, marginBottom: 14 }}>
          <div className="arq-profile-avatar" style={{ width: 44, height: 44, fontSize: 18 }}>
            ARQ
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.02em', color: 'var(--label)' }}>
              {t('Install ARQ App')}
            </div>
            <div className="dim small">{t('Full-screen standalone native experience')}</div>
          </div>
        </div>

        <div className="sect-b" style={{ padding: '14px 16px', marginBottom: 16 }}>
          {isIOS ? (
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--label-2)' }}>
              1. Tap the <strong>Share</strong> button <Icon name="upload" style={{ display: 'inline-block', verticalAlign: 'middle' }} /> in Safari.<br />
              2. Scroll down and select <strong>Add to Home Screen</strong>.<br />
              3. Tap <strong>Add</strong> in the top right corner.
            </div>
          ) : (
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--label-2)' }}>
              1. Open your browser menu (⋮ or <Icon name="gear" style={{ display: 'inline-block', verticalAlign: 'middle' }} />).<br />
              2. Select <strong>Install App</strong> or <strong>Add to Home screen</strong>.<br />
              3. Launch ARQ directly from your home screen.
            </div>
          )}
        </div>

        <button className="btn primary" onClick={close} style={{ width: '100%' }}>
          {t('Got it')}
        </button>
      </div>
    ))
  }
}

export default function InstallPrompt() {
  const [canInstall, setCanInstall] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    try { return !!sessionStorage.getItem('arq_pwa_dismissed') } catch { return false }
  })

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
    if (isStandalone) return

    const handleBeforeInstallPrompt = e => {
      e.preventDefault()
      deferredPrompt = e
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // On non-standalone browsers, allow the prompt banner if not standalone
    const isMobileBrowser = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent)
    if (isMobileBrowser && !isStandalone) {
      setCanInstall(true)
    } else if (!isStandalone) {
      // Also show on desktop browsers to let users install
      setCanInstall(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  if (!canInstall || dismissed) return null

  const onInstallClick = () => {
    triggerPWAInstall(accepted => {
      if (accepted) {
        setCanInstall(false)
      }
    })
  }

  const onDismiss = () => {
    setDismissed(true)
    try { sessionStorage.setItem('arq_pwa_dismissed', '1') } catch {}
  }

  return (
    <div className="pwa-install-banner">
      <div className="pwa-install-icon">
        ARQ
      </div>
      <div className="pwa-install-info">
        <div className="pwa-install-title">{t('Install ARQ App')}</div>
        <div className="pwa-install-sub">{t('Instant launch & offline standalone app')}</div>
      </div>
      <button className="pwa-install-btn" onClick={onInstallClick}>
        {t('Install')}
      </button>
      <button className="pwa-dismiss-btn" onClick={onDismiss} aria-label={t('Dismiss')}>
        <Icon name="xmark" />
      </button>
    </div>
  )
}
