import { onScroll } from './_smooth-scroll'

// GSAP（CDNで読み込み：_footer.ejs）を使ったスクロールアニメーション
// ※GSAP本体と ScrollTrigger は index.js より先に読み込むこと
//
// .js-clip-reveal：画面に入ったら下から切り抜きが開くように表示
//                  （JS読み込み前のチラつき防止の初期状態は _parts.scss）
export const initGsapScroll = () => {
  const { gsap, ScrollTrigger } = window
  // GSAPが読み込めなかった場合も、ほかの処理（MVの切り替えなど）は止めない
  if (!gsap || !ScrollTrigger) {
    console.warn('GSAP / ScrollTrigger が読み込まれていません')
    document.querySelectorAll('.js-clip-reveal').forEach((el) => {
      el.style.clipPath = 'none'
      el.style.transform = 'none'
    })
    return
  }

  gsap.registerPlugin(ScrollTrigger)

  // Lenis（なめらかスクロール）のスクロール位置を ScrollTrigger に伝える
  onScroll(ScrollTrigger.update)

gsap.utils.toArray(".js-clip-reveal").forEach((el) => {
  gsap.fromTo(el,
    { clipPath: "inset(0 0 100% 0)", y: 20 },
    {
      clipPath: "inset(0 0 0% 0)",
      y: 0,
      duration: 1.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    }
  );
});

  // ページの高さが変わったら、開始位置を計算し直す
  // （ScrollTrigger は初期化時と読み込み完了時のレイアウトで開始位置を覚えるため、
  //   その後に Adobe Fonts の切り替えなどで高さが変わると、下の方の要素ほど開始位置がずれる）
  let timer = null
  let lastHeight = document.body.scrollHeight
  new ResizeObserver(() => {
    const height = document.body.scrollHeight
    if (height === lastHeight) return
    lastHeight = height
    clearTimeout(timer)
    timer = setTimeout(() => ScrollTrigger.refresh(), 200)
  }).observe(document.body)
}
