import { onScroll, prefersReducedMotion } from './_smooth-scroll'

// .js-scale-up：下から入ってきて、スクロールに合わせて大きくなる
// （参考：houyhnhnm.jp/mybuddy996 の About。進み具合 --p（0〜1）を CSS に渡し、大きさは CSS 側で計算）
//
// 進み具合 --p
//   0：要素の上端が画面の下に来たとき
//   1：要素の上端が画面の上から20%の位置に来たとき
// ※参考サイトは画面に固定（sticky）して拡大しているが、.item-img-xl は画面より背が高いため固定はしない
const END = 0.2

export const initScaleUp = () => {
  const targets = [...document.querySelectorAll('.js-scale-up')]
  if (!targets.length) return

  // 「視差効果を減らす」設定では動かさず、最初から原寸で表示
  if (prefersReducedMotion) {
    targets.forEach((el) => el.style.setProperty('--p', 1))
    return
  }

  let ticking = false

  const update = () => {
    ticking = false
    const vh = window.innerHeight
    targets.forEach((el) => {
      // scale の影響を受けない位置で計算するため、親要素ではなく offsetTop から求める
      const top = el.offsetTop - window.scrollY + getOffsetParentTop(el)
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * (1 - END))))
      el.style.setProperty('--p', p.toFixed(4))
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

// offsetParent をたどってページ上の位置（transformの影響を受けない）を求める
const getOffsetParentTop = (el) => {
  let top = 0
  let parent = el.offsetParent
  while (parent) {
    top += parent.offsetTop
    parent = parent.offsetParent
  }
  return top
}
