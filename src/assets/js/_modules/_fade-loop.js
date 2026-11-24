// .js-fade-loop の中の要素（子要素）を、フェードで順番に切り替えてループする
// 表示中の要素に is-active。フェードの速さは CSS（例：_ending.scss の transition: opacity 1.5s）
// 前の写真が消えるのと同時に次の写真が現れる（重ねて切り替える）
const INTERVAL = 6000

export const initFadeLoop = () => {
  document.querySelectorAll('.js-fade-loop').forEach((loop) => {
    const items = [...loop.children]
    if (items.length < 2) return

    let current = Math.max(0, items.findIndex((item) => item.classList.contains('is-active')))
    items.forEach((item, i) => item.classList.toggle('is-active', i === current))

    setInterval(() => {
      items[current].classList.remove('is-active')
      current = (current + 1) % items.length
      items[current].classList.add('is-active')
    }, INTERVAL)
  })
}
