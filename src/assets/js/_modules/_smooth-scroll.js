// なめらかスクロール（参考：shinka-masumi.jp と同じ Lenis の設定）
// Lenis は CDN から読み込む（_footer.ejs。index.js より先に読み込むこと）
// 「視差効果を減らす」設定のOSでは使わず、通常のスクロールにする
// Lenis が読み込めなかった場合も、通常のスクロールで動くようにしている
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export const initSmoothScroll = () => {
  const { Lenis } = window
  if (!Lenis) console.warn('Lenis が読み込まれていません')
  if (Lenis && !prefersReducedMotion) {
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

// 止まる位置の上の余白は、移動先の要素の CSS「scroll-margin-top」で指定する
// （例：_allitems.scss の .allitems-category）。指定がなければ要素の上端ぴったりに止まる
export const scrollToTarget = (target) => {
  if (lenis) {
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0
    lenis.scrollTo(target, { duration: 1.4, offset: -margin })
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
