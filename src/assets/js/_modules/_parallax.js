import { onScroll, prefersReducedMotion } from './_smooth-scroll'

// パララックス（視差効果）
// .js-parallax：枠の中の画像を、枠より遅く動かす（奥にあるように見える）
//               data-parallax-scale で画像の拡大率（＝動ける幅）を変えられる。初期値 1.15
// .js-float  ：要素ごと、スクロールより速く動かす（手前に浮いて見える）
//               data-float-speed で速さを変えられる。初期値 0.08（画面の高さに対する割合）
// どちらも要素が画面の中央に来たとき、デザインどおりの位置になる

const clamp = (value) => Math.min(1, Math.max(-1, value))

// 画面中央からのずれ（-1〜1）。画面下から入ってくるとき 1、上に抜けるとき -1
const getProgress = (rect, vh) => {
  return clamp((rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2))
}

export const initParallax = () => {
  if (prefersReducedMotion) return

  const parallaxItems = [...document.querySelectorAll('.js-parallax')].map((el) => ({
    el,
    img: el.querySelector('img'),
    scale: parseFloat(el.dataset.parallaxScale || 1.15),
  }))
  const floatItems = [...document.querySelectorAll('.js-float')].map((el) => ({
    el,
    speed: parseFloat(el.dataset.floatSpeed || 0.08),
  }))

  let ticking = false

  const update = () => {
    ticking = false
    const vh = window.innerHeight

    parallaxItems.forEach(({ el, img, scale }) => {
      if (!img) return
      const rect = el.getBoundingClientRect()
      if (rect.bottom < -vh * 0.5 || rect.top > vh * 1.5) return
      // 拡大で生まれた余白（上下それぞれ (scale - 1) / 2）の範囲で動かす
      const max = (rect.height * (scale - 1)) / 2
      const y = -getProgress(rect, vh) * max
      img.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale})`
    })

    floatItems.forEach(({ el, speed }) => {
      // transform前の位置で計算するため、今の移動量を差し引く
      const current = parseFloat(el.dataset.floatY || 0)
      const rect = el.getBoundingClientRect()
      const baseRect = { top: rect.top - current, height: rect.height }
      if (baseRect.top + rect.height < -vh * 0.5 || baseRect.top > vh * 1.5) return
      const y = getProgress(baseRect, vh) * vh * speed
      el.dataset.floatY = y
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
    })
  }

  const requestUpdate = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }

  onScroll(requestUpdate)
  window.addEventListener('resize', requestUpdate)
  window.addEventListener('load', requestUpdate)
  update()
}
