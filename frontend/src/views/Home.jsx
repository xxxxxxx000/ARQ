import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { effectiveRoutine, effectiveRoutineId, streakWeeks, lastBW, setsDoneActive } from '../lib/history.js'
import { fmtNum, fmtDate, todayISO, isoOf, weekKey, DAYS } from '../lib/format.js'
import { t, dateLocale } from '../lib/i18n.js'
import { bwSheet, goalSheet, dayOverrideSheet, calendarSheet, startFlow, loadStarterPlan, bwDeltaColor } from '../sheets.jsx'
import LineChart from '../components/LineChart.jsx'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'
import { glyphOf } from '../lib/glyphs.js'

// Home = what to do now + a quick glance. Deep charts & history live in Stats.
export default function Home() {
  const nav = useNavigate()
  const S = useStore(s => s.S)
  const user = useStore(s => s.user)
  const [weekOffset, setWeekOffset] = useState(0)

  const today = new Date()
  const routine = effectiveRoutine(S, todayISO())
  const todayOvr = S.dayPlan[todayISO()] !== undefined
  const bw = lastBW(S)
  const prevBW = S.bodyweight.length > 1 ? S.bodyweight[S.bodyweight.length - 2] : null
  const delta = bw && prevBW ? bw.w - prevBW.w : null

  const monday = new Date(today); monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7)
  const doneDays = new Set(S.workouts.map(w => w.d))
  const strip = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday); d.setDate(monday.getDate() + i)
    const iso = isoOf(d)
    const eff = effectiveRoutineId(S, iso), ovr = S.dayPlan[iso] !== undefined, done = doneDays.has(iso)
    const dot = done ? ' done' : ovr && eff ? ' ovr' : eff ? ' plan' : ''
    strip.push(<div key={i} className={'wday' + (iso === todayISO() ? ' today' : '')} onClick={() => dayOverrideSheet(iso)}>
      <div className="lbl">{t(DAYS[d.getDay()])}</div><div className="num">{d.getDate()}</div><div className={'dot' + dot} /></div>)
  }
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6)
  const wkLabel = weekOffset === 0 ? t('This week') : `${monday.getDate()} ${monday.toLocaleDateString(dateLocale(), { month: 'short' })} – ${sunday.getDate()} ${sunday.toLocaleDateString(dateLocale(), { month: 'short' })}`

  const wThisWeek = S.workouts.filter(w => weekKey(w.d) === weekKey(todayISO())).length
  const plannedPerWeek = Object.keys(S.week).filter(k => S.week[k]).length
  const bwPoints = S.bodyweight.slice(-30).map(b => ({ t: b.t || new Date(b.d).getTime(), y: b.w, d: b.d }))

  // today's session action
  const onToday = () => { if (S.active) nav('/workout'); else if (routine) startFlow(routine.id); else dayOverrideSheet(todayISO()) }

  return <div>
    {/* Responsive Bento Grid Command Center */}
    <div className="home-bento">
      {/* Left Bento Zone: Main Protocol & Action Hub */}
      <div className="bento-main">
        {/* ARQ Executive Top Bar */}
        <div className="home-top-bar">
          <div className="home-user-badge">
            <div className="home-avatar">
              {user ? user.name.slice(0, 2).toUpperCase() : 'ARQ'}
            </div>
            <div>
              <div className="home-greeting">{user ? t('Hi {0}', user.name) : 'ARQ Athlete'}</div>
              <div className="home-date">{today.toLocaleDateString(dateLocale(), { weekday: 'long', month: 'short', day: 'numeric' })}</div>
            </div>
          </div>
          <button className="iconbtn" onClick={() => nav('/settings')} aria-label={t('Settings')} style={{ width: 40, height: 40 }}>
            <Icon name="gear" />
          </button>
        </div>

        {/* ARQ Studio Hero Card */}
        <div className="studio-hero">
          <div className="row between" style={{ marginBottom: 8 }}>
            <div className="studio-hero-tag" style={S.active ? { background: 'var(--orange)', color: '#000' } : undefined}>
              <Icon name={S.active ? 'timer' : routine ? 'dumbbell' : 'moon'} style={{ fontSize: 12 }} />
              <span>{S.active ? t('In Progress') : routine ? t('Daily Target') : t('Recovery Mode')}</span>
            </div>
            {todayOvr && routine && <span className="dim small" style={{ fontSize: 11, fontWeight: 600 }}>{t('Rescheduled')}</span>}
          </div>

          <div className="studio-hero-title">
            {S.active ? S.active.name : routine ? routine.name : t('Active Recovery')}
          </div>

          <div className="studio-hero-sub">
            {S.active ? t('Workout in session — tap to resume logging')
              : routine ? (
                <span>{routine.ex?.length || 0} {t('movements scheduled')} {routine.ex?.length ? `· ${routine.ex.map(e => e.id).slice(0, 3).join(', ')}${routine.ex.length > 3 ? '…' : ''}` : ''}</span>
              ) : t('Focus on hydration, protein intake, mobility, and deep sleep.')}
          </div>

          {routine || S.active ? (
            <button className="btn primary" onClick={onToday} style={{ width: '100%', padding: '13px 18px', borderRadius: 14 }}>
              <Icon name={S.active ? 'play' : 'dumbbell'} />
              <span>{S.active ? t('Resume Workout') : t('Start Workout')}</span>
            </button>
          ) : (
            <div className="studio-hero-actions">
              <Button variant="tinted" icon="plus" onClick={onToday} style={{ flex: 1 }}>{t('Log Workout')}</Button>
              <Button variant="tinted" icon="calendar" onClick={() => nav('/plan')} style={{ flex: 1 }}>{t('View Plan')}</Button>
            </div>
          )}
        </div>

        {/* Vitals Telemetry Grid (Body Composition & Momentum) */}
        <div className="editorial-metrics">
          {/* Body Weight Block */}
          <div className="editorial-metric-box" onClick={() => bwSheet()}>
            <div className="editorial-metric-kicker">
              <span>{t('Body Weight')}</span>
              <Icon name="scale" style={{ fontSize: 13, color: 'var(--acc)' }} />
            </div>
            <div>
              <div className="editorial-metric-val">
                {bw ? fmtNum(bw.w) : '—'} <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--label-2)' }}>{S.unit}</span>
              </div>
              <div className="editorial-metric-sub" style={{ marginTop: 4 }}>
                {bw ? (delta ? `${delta > 0 ? '+' : ''}${fmtNum(delta)} ${S.unit}` : t('Logged')) : t('Tap to log')}
              </div>
            </div>
          </div>

          {/* Streak / Momentum Block */}
          <div className="editorial-metric-box" onClick={() => calendarSheet()}>
            <div className="editorial-metric-kicker">
              <span>{t('Weekly Streak')}</span>
              <Icon name="flame" style={{ fontSize: 13, color: 'var(--orange)' }} />
            </div>
            <div>
              <div className="editorial-metric-val" style={{ color: 'var(--orange)' }}>
                {streakWeeks(S)} <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--label-2)' }}>{t('wks')}</span>
              </div>
              <div className="editorial-metric-sub" style={{ marginTop: 4 }}>
                {wThisWeek} {t('sessions this week')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Bento Zone: 7-Day Horizon & Studio Tools */}
      <div className="bento-side">
        {/* 7-Day Interactive Training Horizon */}
        <div className="card" style={{ padding: '16px 18px', marginBottom: 0 }}>
          <div className="row between" style={{ marginBottom: 8 }}>
            <button className="iconbtn" style={{ width: 28, height: 28, fontSize: 13 }} onClick={() => setWeekOffset(w => w - 1)} aria-label="Previous week"><Icon name="chevronLeft" /></button>
            <div className="small muted" style={{ fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', fontSize: 10.5 }}>{wkLabel}</div>
            <button className="iconbtn" style={{ width: 28, height: 28, fontSize: 13 }} onClick={() => setWeekOffset(w => w + 1)} aria-label="Next week"><Icon name="chevronRight" /></button>
          </div>
          <div className="horizon-strip">{strip}</div>
        </div>

        {/* Quick Launchpad Toolbar */}
        <div className="launchpad-grid">
          <div className="launchpad-chip" onClick={() => nav('/library')}>
            <Icon name="dumbbell" className="launchpad-chip-icon" />
            <span className="launchpad-chip-label">{t('Movements')}</span>
          </div>
          <div className="launchpad-chip" onClick={() => nav('/plan')}>
            <Icon name="calendar" className="launchpad-chip-icon" />
            <span className="launchpad-chip-label">{t('Plan')}</span>
          </div>
          <div className="launchpad-chip" onClick={() => nav('/stats')}>
            <Icon name="chart" className="launchpad-chip-icon" />
            <span className="launchpad-chip-label">{t('Analytics')}</span>
          </div>
        </div>

        {!S.routines.length && !S.active && (
          <div className="card" style={{ padding: '18px 20px', marginBottom: 0 }}>
            <div className="row" style={{ gap: 10, marginBottom: 6 }}>
              <span className="lrow-i"><Icon name="dumbbell" /></span>
              <div className="big" style={{ fontSize: 20 }}>{t('Welcome!')}</div>
            </div>
            <div className="muted small" style={{ marginBottom: 12 }}>{t('Set up your weekly routine to get going — or load a ready-made Push / Pull / Legs plan.')}</div>
            <Button variant="primary" icon="layers" onClick={loadStarterPlan}>{t('Load starter plan (PPL)')}</Button>
          </div>
        )}
      </div>
    </div>
  </div>
}
