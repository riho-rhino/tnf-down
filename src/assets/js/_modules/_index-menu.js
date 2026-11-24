import { scrollToTarget, stopScroll, startScroll, onScroll } from './_smooth-scroll'

// 下部に追従するINDEXボタン。押すとメニューが開く（SP：下から全画面 / PC：右からパネル）
export const initIndexMenu = () => {
  const menu = document.querySelector('.index-menu')
  if (!menu) return
  const btn = menu.querySelector('.index-menu-btn')
  const panel = menu.querySelector('.index-menu-panel')

  const open = () => {
    menu.classList.add('is-open')
    document.body.classList.add('is-menu-open') // SP：後ろのページをぼかす（_index-menu.scss）
    btn.setAttribute('aria-expanded', 'true')
    panel.setAttribute('aria-hidden', 'false')
    stopScroll()
  }
  const close = () => {
    menu.classList.remove('is-open')
    document.body.classList.remove('is-menu-open')
    btn.setAttribute('aria-expanded', 'false')
    panel.setAttribute('aria-hidden', 'true')
    startScroll()
  }

  btn.addEventListener('click', () => {
    menu.classList.contains('is-open') ? close() : open()
  })

  // メニュー内のリンク：閉じてから移動する
  panel.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopImmediatePropagation()
      const target = document.querySelector(link.getAttribute('href'))
      close()
      if (target) scrollToTarget(target)
    })
  })

  // PC：パネルの外（暗くした部分）をクリックしたら閉じる
  const overlay = menu.querySelector('.index-menu-overlay')
  if (overlay) overlay.addEventListener('click', close)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close()
  })

  // footer（締めのビジュアル）に入ったらボタンを隠す
  // 判定：footer の上端が、ボタンの下端より上に来たとき（ボタンと footer が重なり始めたら）
  const footer = document.querySelector('.ending-wrap')
  if (footer) {
    const checkFooter = () => {
      const hide = footer.getBoundingClientRect().top < btn.getBoundingClientRect().bottom
      // メニューを開いている間は隠さない
      menu.classList.toggle('is-hidden', hide && !menu.classList.contains('is-open'))
    }
    onScroll(checkFooter)
    window.addEventListener('resize', checkFooter)
    checkFooter()
  }
}
