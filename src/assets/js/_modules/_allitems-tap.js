// ALL ITEMS：タッチ操作の端末（スマホ・タブレット）でのタップの動き
// ・1回目のタップ：撮影カットに切り替える（ページは移動しない）
// ・2回目のタップ：そのままアイテムページへ移動
// ・別の商品をタップしたら、前に切り替えた商品は商品画像に戻す
// マウスで操作する端末（PC）は、ホバーで切り替わる（_allitems.scss）ので何もしない
export const initAllitemsTap = () => {
  const links = [...document.querySelectorAll('.allitems-link')]
  if (!links.length) return

  // 「ホバーできない端末」＝タッチ操作の端末
  const isTouch = window.matchMedia('(hover: none)')

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (!isTouch.matches) return
      if (link.classList.contains('is-shot')) return // 2回目：そのまま移動

      // 1回目：移動を止めて撮影カットに切り替える
      e.preventDefault()
      links.forEach((other) => other.classList.remove('is-shot'))
      link.classList.add('is-shot')
    })
  })
}
