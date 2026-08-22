import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { uid, exCount } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import { dayAssignSheet, loadStarterPlan, planToolsSheet } from '../sheets.jsx'
import { EXIDX } from '../lib/exercises.js'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'
import { glyphOf, DEFAULT_GLYPH } from '../lib/glyphs.js'

export default function Plan() {
  const nav = useNavigate()
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)

  const activeDays = [1, 2, 3, 4, 5, 6, 0].filter(d => !!S.week[d]).length

  const addRoutine = () => {
    const r = { id: uid(), name: t('New routine'), emoji: DEFAULT_GLYPH, ex: [] }
    update(s => { s.routines.push(r) })
    nav('/plan/r/' + r.id)
  }

  return <div style={{ paddingBottom: 110 }}>
    {/* Executive Header */}
    <div className="hdr" style={{ marginBottom: 16, alignItems: 'flex-start' }}>
      <div>
        <div className="editorial-kicker">
          <span>{t('Training Architecture')}</span>
        </div>
        <div className="editorial-title">{t('Plan')}</div>
      </div>
      <div className="row" style={{ gap: 8 }}>
        <button className="iconbtn" onClick={planToolsSheet} aria-label={t('Share your plan')} title={t('Share your plan')} style={{ width: 40, height: 40 }}>
          <Icon name="upload" />
        </button>
      </div>
    </div>

    {/* Compact Weekly Schedule Strip */}
    <div className="card" style={{ padding: '14px 16px', marginBottom: 18 }}>
      <div className="row between" style={{ marginBottom: 10 }}>
        <div>
          <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--acc)' }}>
            {t('Weekly Schedule')}
          </span>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--label)', marginTop: 1 }}>
            {activeDays > 0 ? t('{0} Days Active · {1} Recovery', activeDays, 7 - activeDays) : t('No Split Configured')}
          </div>
        </div>
        <Button size="xs" variant="tinted" icon="layers" onClick={loadStarterPlan}>{t('PPL Split')}</Button>
      </div>

      {/* 7-Day Matrix Strip */}
      <div className="horizon-strip" style={{ margin: 0 }}>
        {[1, 2, 3, 4, 5, 6, 0].map(d => {
          const r = S.routines.find(x => x.id === S.week[d])
          const dayShort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d]
          return (
            <div
              key={d}
              className={'horizon-day' + (r ? ' today' : '')}
              onClick={() => dayAssignSheet(d)}
              title={r ? `${dayShort}: ${r.name}` : `${dayShort}: Rest`}
              style={{ padding: '8px 2px', minHeight: 58 }}
            >
              <span className="horizon-day-name">{dayShort}</span>
              <Icon name={r ? glyphOf(r.emoji) : 'moon'} style={{ fontSize: 13, color: r ? 'var(--acc)' : 'var(--label-3)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: r ? 'var(--label)' : 'var(--label-3)', maxWidth: 42, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r ? r.name : t('Rest')}
              </span>
            </div>
          )
        })}
      </div>
    </div>

    {/* Workout Blueprints Section */}
    <div className="row between" style={{ marginBottom: 12, padding: '0 4px' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-.025em', color: 'var(--label)' }}>{t('Workout Blueprints')}</h2>
        <span className="dim small" style={{ fontSize: 12 }}>{t('{0} routines configured', S.routines.length)}</span>
      </div>
      <Button size="sm" variant="tinted" icon="plus" onClick={addRoutine}>{t('New Routine')}</Button>
    </div>

    {S.routines.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
        {S.routines.map(r => (
          <div key={r.id} className="blueprint-card" onClick={() => nav('/plan/r/' + r.id)}>
            <div className="blueprint-head">
              <div className="row" style={{ gap: 12 }}>
                <div className="blueprint-icon-box">
                  <Icon name={glyphOf(r.emoji)} />
                </div>
                <div>
                  <div className="blueprint-title capitalize">{r.name}</div>
                  <div className="blueprint-sub">{exCount(r.ex.length)}</div>
                </div>
              </div>
              <Icon name="chevronRight" className="lrow-c" />
            </div>

            {r.ex.length > 0 ? (
              <div className="blueprint-pills">
                {r.ex.slice(0, 5).map((ex, i) => (
                  <span key={i} className="ex-pill" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--label)' }}>
                    {EXIDX[ex.id]?.n || ex.id}
                  </span>
                ))}
                {r.ex.length > 5 && (
                  <span className="ex-pill" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--acc)' }}>
                    +{r.ex.length - 5} more
                  </span>
                )}
              </div>
            ) : (
              <div className="dim small" style={{ marginTop: 10 }}>{t('No exercises added yet — tap to configure')}</div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="card" style={{ textAlign: 'center', padding: '32px 18px', marginBottom: 0 }}>
        <div className="empty" style={{ padding: '10px 0 16px' }}>
          <div className="ico" style={{ fontSize: 36, color: 'var(--acc)', marginBottom: 10 }}><Icon name="clipboard" /></div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--label)' }}>{t('No routines configured yet')}</div>
          <div className="dim small" style={{ marginTop: 4, marginBottom: 16 }}>{t('Create custom routines or load a proven starter split.')}</div>
        </div>
        <Button variant="primary" icon="layers" onClick={loadStarterPlan}>{t('Load Starter Plan (Push / Pull / Legs)')}</Button>
      </div>
    )}
  </div>
}
