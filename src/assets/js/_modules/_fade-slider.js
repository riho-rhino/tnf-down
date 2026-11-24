// SP：商品の画像2枚をフェードで切り替える（PCは2枚横並びのため見た目は変わらない）
// ・自動：INTERVAL ごとに次の画像へ
// ・手動：ドットのタップ／左右のスワイプ（SPのみ）
const INTERVAL = 4000
const SWIPE = 40 // これ以上横に動かしたらスワイプとみなす（px）
const isSp = window.matchMedia('(max-width: 919px)') // _mixin.scss の sp と同じ幅

export const initFadeSlider = () => {
  document.querySelectorAll('.item-slider').forEach((slider) => {
    const slides = [...slider.querySelectorAll('.item-slider-track .item-img')]
    const dots = [...slider.querySelectorAll('.item-slider-dots li')]
    if (slides.length < 2) return

    let current = 0
    let timer = null

    const show = (index) => {
      current = (index + slides.length) % slides.length
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current))
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current))
    }

    const start = () => {
      stop()
      timer = setInterval(() => show(current + 1), INTERVAL)
    }
    const stop = () => {
      if (timer) clearInterval(timer)
      timer = null
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        show(i)
        start()
      })
    })

    // スワイプ：指（マウス）を置いた位置と離した位置の差で判定
    // 縦の動きの方が大きいときはページのスクロールとみなして何もしない
    const track = slider.querySelector('.item-slider-track')
    let startX = null
    let startY = 0
    track.addEventListener('pointerdown', (e) => {
      if (!isSp.matches) return
      startX = e.clientX
      startY = e.clientY
    })
    track.addEventListener('pointerup', (e) => {
      if (startX === null) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      startX = null
      if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy)) return
      show(current + (dx < 0 ? 1 : -1)) // 左へスワイプ → 次、右へ → 前
      start() // 自動切り替えの時間をリセット
    })
    // 縦スクロールが始まるなどして操作が中断されたとき
    track.addEventListener('pointercancel', () => {
      startX = null
    })

    // 画面に入っている間だけ自動で切り替える
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? start() : stop()))
    })
    observer.observe(slider)
  })
}
