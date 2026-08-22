import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { EXDB, BODYPARTS, allExercises, equipmentOf, imgSrc, gifSrc } from '../lib/exercises.js'
import { bestWeightFor } from '../lib/history.js'
import { fmtNum } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import { Thumb } from '../components/Media.jsx'
import { exerciseDetailSheet, addToRoutineSheet, customExSheet } from '../sheets.jsx'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'

export default function Library() {
  const S = useStore(s => s.S)
  const [q, setQ] = useState('')
  const [bp, setBp] = useState('')
  const [eq, setEq] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [shown, setShown] = useState(40)
  const ql = q.toLowerCase().trim()
  const base = allExercises(S).filter(e => (!bp || e.bp === bp) && (!ql || e.n.toLowerCase().includes(ql) || e.tg.includes(ql) || e.eq.includes(ql) || (e.desc || '').toLowerCase().includes(ql)))
  const eqOpts = equipmentOf(base)
  const eqOn = eqOpts.includes(eq) ? eq : ''
  const f = eqOn ? base.filter(e => e.eq === eqOn) : base

  return <>
    {/* Editorial Header */}
    <div className="hdr" style={{ marginBottom: 18, alignItems: 'flex-start' }}>
      <div>
        <div className="editorial-kicker">
          <span>{t('{0} Movement Database', EXDB.length)}</span>
        </div>
        <div className="editorial-title">{t('Exercises')}</div>
      </div>
      <div className="row" style={{ gap: 8 }}>
        <button className="iconbtn" onClick={() => setViewMode(m => m === 'grid' ? 'list' : 'grid')} aria-label={t('Toggle view')} style={{ width: 40, height: 40 }}>
          <Icon name={viewMode === 'grid' ? 'list' : 'chart'} />
        </button>
        <button className="iconbtn" onClick={() => customExSheet(null, ex => exerciseDetailSheet(ex), q.trim())} aria-label={t('Create movement')} title={t('Create movement')} style={{ width: 40, height: 40 }}>
          <Icon name="plus" />
        </button>
      </div>
    </div>

    {/* Search field */}
    <div className="search" style={{ marginBottom: 12 }}>
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      <input className="input" placeholder={t('Search movements, muscles, equipment…')} value={q} onChange={e => { setQ(e.target.value); setShown(40) }} />
    </div>

    {/* Target Body Part Carousel */}
    <div className="chips" style={{ marginBottom: eqOpts.length > 1 ? 8 : 14 }}>
      <button className={'chip nocap' + (!bp ? ' on' : '')} onClick={() => { setBp(''); setEq(''); setShown(40) }}>{t('All')}</button>
      {BODYPARTS.map(b => <button key={b} className={'chip' + (bp === b ? ' on' : '')} onClick={() => { setBp(b); setEq(''); setShown(40) }}>{t(b)}</button>)}
    </div>

    {/* Equipment Filter Carousel */}
    {eqOpts.length > 1 && <div className="chips" style={{ marginBottom: 14 }}>
      <button className={'chip nocap' + (!eqOn ? ' on' : '')} onClick={() => { setEq(''); setShown(40) }}>{t('Any equipment')}</button>
      {eqOpts.map(x => <button key={x} className={'chip' + (eqOn === x ? ' on' : '')} onClick={() => { setEq(x); setShown(40) }}>{t(x)}</button>)}
    </div>}

    {/* Custom Exercise Hero Banner */}
    <div className="custom-ex-banner" onClick={() => customExSheet(null, ex => exerciseDetailSheet(ex), q.trim())}>
      <div className="row" style={{ gap: 12 }}>
        <div className="custom-ex-icon"><Icon name="sparkles" /></div>
        <div>
          <div className="custom-ex-title">{t('Create Custom Movement')}</div>
          <div className="custom-ex-sub">{t('Add bespoke exercises, bodyweight, or special equipment')}</div>
        </div>
      </div>
      <span className="ex-add-btn" style={{ background: 'var(--acc)', color: 'var(--on-acc)' }}>
        <Icon name="plus" />
        <span>{t('Create')}</span>
      </span>
    </div>

    {/* Exercise Grid or List */}
    {viewMode === 'grid' ? (
      <div className="ex-grid">
        {f.slice(0, shown).map(e => {
          const best = bestWeightFor(S, e.id)
          return (
            <div key={e.id} className="ex-card" onClick={() => exerciseDetailSheet(e)}>
              <div className="ex-card-media">
                {e.gif || e.img ? (
                  <img loading="lazy" decoding="async" src={e.gif ? gifSrc(e) : imgSrc(e)} alt={e.n} onError={ev => {
                    if (e.img && ev.target.src !== imgSrc(e)) ev.target.src = imgSrc(e)
                    else ev.target.style.display = 'none'
                  }} />
                ) : (
                  <div style={{ fontSize: 26, color: 'var(--acc)' }}><Icon name="dumbbell" /></div>
                )}

                {best > 0 && (
                  <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.76)', backdropFilter: 'blur(8px)', color: 'var(--yellow)', padding: '2px 6px', borderRadius: 99, fontSize: 10, fontWeight: 700, border: '1px solid rgba(255,255,255,0.12)' }}>
                    {fmtNum(best)} {S.unit}
                  </div>
                )}
              </div>
              <div className="ex-card-body">
                <div>
                  <div className="ex-card-title capitalize">{e.n}</div>
                  <div className="ex-meta" style={{ marginTop: 5 }}>
                    <span className="ex-pill target">{t(e.tg || e.bp)}</span>
                    <span className="ex-pill">{t(e.eq)}</span>
                  </div>
                </div>
                <div className="ex-card-footer">
                  {best > 0 ? (
                    <span className="ex-pill" style={{ color: 'var(--yellow)', background: 'color-mix(in srgb, var(--yellow) 16%, transparent)', fontSize: 9.5 }}>
                      {fmtNum(best)} {S.unit} PR
                    </span>
                  ) : (
                    <span className="dim" style={{ fontSize: 10.5, fontWeight: 500 }}>{t('Demo')}</span>
                  )}
                  <button className="ex-card-btn" onClick={ev => { ev.stopPropagation(); addToRoutineSheet(e) }} title={t('Add to plan')}>
                    <Icon name="plus" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    ) : (
      <div className="list">
        {f.slice(0, shown).map(e => {
          const best = bestWeightFor(S, e.id)
          return <div key={e.id} className="ex-item" onClick={() => exerciseDetailSheet(e)}>
            <Thumb ex={e} />
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="tt capitalize" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.n}</div>
              <div className="ex-meta">
                <span className="ex-pill target">{t(e.tg || e.bp)}</span>
                <span className="ex-pill">{t(e.eq)}</span>
                {best > 0 && <span className="ex-pill" style={{ color: 'var(--yellow)', background: 'color-mix(in srgb, var(--yellow) 15%, transparent)' }}>{fmtNum(best)} {S.unit} PR</span>}
              </div>
            </div>
            <button className="ex-add-btn" onClick={ev => { ev.stopPropagation(); addToRoutineSheet(e) }} title={t('Add to plan')}>
              <Icon name="plus" />
              <span>{t('Plan')}</span>
            </button>
          </div>
        })}
      </div>
    )}

    {f.length === 0 && <div className="empty"><div className="ico"><Icon name="magnifier" /></div>{t('No match')}</div>}
    {f.length > shown && <><div style={{ height: 16 }} /><Button onClick={() => setShown(s => s + 40)}>{t('Show more')}</Button></>}
  </>
}
