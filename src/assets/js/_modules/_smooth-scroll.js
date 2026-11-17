import Lenis from 'lenis'

// なめらかスクロール（参考：shinka-masumi.jp と同じ Lenis の設定）
// 「視差効果を減らす」設定のOSでは使わず、通常のスクロールにする
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export const initSmoothScroll = () => {
  if (!prefersReducedMotion) {
    lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 1.2,
    })
    const raf = (time) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }

  // ページ内リンク（#new など）
  document.querySelectorAll('.tnf-down-wrapper a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      scrollToTarget(target)
    })
  })

  return lenis
}

export const scrollToTarget = (target) => {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 })
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }
}

// スクロール位置が変わるたびに呼ぶ処理を登録（パララックス用）
export const onScroll = (callback) => {
  if (lenis) {
    lenis.on('scroll', callback)
  } else {
    window.addEventListener('scroll', callback, { passive: true })
  }
}

// メニューを開いている間は背景のスクロールを止める
export const stopScroll = () => {
  if (lenis) lenis.stop()
  document.body.classList.add('noscroll')
}
export const startScroll = () => {
  if (lenis) lenis.start()
  document.body.classList.remove('noscroll')
}
