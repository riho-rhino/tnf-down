// SP：商品の画像2枚をフェードで切り替える（PCは2枚横並びのため見た目は変わらない）
const INTERVAL = 4000

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

    // 画面に入っている間だけ自動で切り替える
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? start() : stop()))
    })
    observer.observe(slider)
  })
}
