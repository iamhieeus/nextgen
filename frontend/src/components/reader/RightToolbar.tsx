'use client'

import { useState, useEffect, useRef, forwardRef } from 'react'
import { FONT_SIZES, LINE_HEIGHTS, type FontKey, type LhKey } from './reader-settings'

type Props = {
  isNight: boolean
  onNightToggle: () => void
  fontSize: FontKey
  onFontSize: (v: FontKey) => void
  lineHeight: LhKey
  onLineHeight: (v: LhKey) => void
}

export default function RightToolbar({ isNight, onNightToggle, fontSize, onFontSize, lineHeight, onLineHeight }: Props) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showToTop, setShowToTop] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)
  const settingsBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setShowToTop(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(e.target as Node)
      ) {
        setIsSettingsOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      {/* Settings panel */}
      <div
        ref={settingsRef}
        className={`fixed right-[80px] top-1/2 -translate-y-1/2 z-[300] rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,.14)] p-[16px] w-[220px] border${isSettingsOpen ? ' block' : ' hidden'}`}
        style={{ background: 'var(--rd-panel)', borderColor: 'var(--rd-border)' }}
      >
        <SettingLabel>Cỡ chữ</SettingLabel>
        <div className="flex items-center gap-[8px] mb-[14px]">
          {(['sm', 'md', 'lg'] as FontKey[]).map((k) => (
            <button
              key={k}
              onClick={() => onFontSize(k)}
              className={`flex-1 py-[7px] text-[13px] rounded-[4px] border cursor-pointer transition-all duration-150${fontSize === k ? ' border-ac text-ac' : ' border-[var(--rd-border)] text-[var(--rd-text-sub)]'}`}
              style={{ background: fontSize === k ? '#fff0f0' : '#f5f5f5' }}
            >
              {k === 'sm' ? 'Nhỏ' : k === 'md' ? 'Vừa' : 'To'}
            </button>
          ))}
        </div>

        <SettingLabel>Giãn dòng</SettingLabel>
        <div className="flex items-center gap-[8px]">
          {(['tight', 'normal', 'loose'] as LhKey[]).map((k) => (
            <button
              key={k}
              onClick={() => onLineHeight(k)}
              className={`flex-1 py-[7px] text-[13px] rounded-[4px] border cursor-pointer transition-all duration-150${lineHeight === k ? ' border-ac text-ac' : ' border-[var(--rd-border)] text-[var(--rd-text-sub)]'}`}
              style={{ background: lineHeight === k ? '#fff0f0' : '#f5f5f5' }}
            >
              {k === 'tight' ? 'Hẹp' : k === 'normal' ? 'Vừa' : 'Rộng'}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="fixed right-[20px] top-1/2 -translate-y-1/2 z-[200] flex flex-col gap-[5px]">
        {[
          { icon: '☰', label: 'Mục Lục', href: '/stories/1' },
          { icon: '📖', label: 'Chi Tiết', href: '/stories/1' },
          { icon: '📚', label: 'Tủ Sách', href: '#' },
          { icon: '🗳️', label: 'Bình Chọn', href: '#' },
        ].map(({ icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="flex flex-col items-center justify-center gap-[3px] w-[56px] h-[60px] border rounded-[6px] text-[10.5px] shadow-[0_1px_5px_rgba(0,0,0,.07)] transition-all duration-150 hover:border-ac hover:text-ac cursor-pointer"
            style={{ background: 'var(--rd-panel)', borderColor: 'var(--rd-border)', color: 'var(--rd-text-sub)' }}
          >
            <span className="text-[18px] leading-none">{icon}</span>
            <span>{label}</span>
          </a>
        ))}

        <ToolbarButton icon="🌙" label="Ban Đêm" active={isNight} onClick={onNightToggle} />

        <ToolbarButton
          ref={settingsBtnRef}
          icon="⚙️"
          label="Cài Đặt"
          active={isSettingsOpen}
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        />

        <a
          href="#"
          className="flex flex-col items-center justify-center gap-[3px] w-[52px] h-[56px] border rounded-[6px] text-[10.5px] shadow-[0_1px_5px_rgba(0,0,0,.07)] transition-all duration-150 hover:border-ac hover:text-ac cursor-pointer"
          style={{ background: 'var(--rd-panel)', borderColor: 'var(--rd-border)', color: 'var(--rd-text-sub)' }}
        >
          <span className="text-[18px] leading-none">📱</span>
          <span>Ứng Dụng</span>
        </a>

        {showToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center gap-[3px] w-[52px] h-[56px] border rounded-[6px] text-[10.5px] shadow-[0_1px_5px_rgba(0,0,0,.07)] transition-all duration-150 hover:border-ac hover:text-ac cursor-pointer"
            style={{ background: 'var(--rd-panel)', borderColor: 'var(--rd-border)', color: 'var(--rd-text-sub)' }}
          >
            <span className="text-[18px] leading-none">↑</span>
            <span>Đầu Trang</span>
          </button>
        )}
      </div>
    </>
  )
}

function SettingLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-[.5px] uppercase mb-[8px]" style={{ color: 'var(--rd-text-muted)' }}>
      {children}
    </div>
  )
}

const ToolbarButton = forwardRef<HTMLButtonElement, {
  icon: string
  label: string
  active: boolean
  onClick: () => void
}>(({ icon, label, active, onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-[3px] w-[52px] h-[56px] border rounded-[6px] text-[10.5px] shadow-[0_1px_5px_rgba(0,0,0,.07)] transition-all duration-150 cursor-pointer${active ? ' border-ac text-ac' : ' hover:border-ac hover:text-ac'}`}
    style={{
      background: active ? '#fff0f0' : 'var(--rd-panel)',
      borderColor: active ? '#e5353e' : 'var(--rd-border)',
      color: active ? '#e5353e' : 'var(--rd-text-sub)',
    }}
  >
    <span className="text-[18px] leading-none">{icon}</span>
    <span>{label}</span>
  </button>
))
ToolbarButton.displayName = 'ToolbarButton'
