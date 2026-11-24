import { onScroll } from './_smooth-scroll'

// body の背景色を、スクロールに合わせて各セクションの色へ少しずつ変える
// ・対象は .js-bg-section。色は CSS の --bg-color で指定（例：_category.scss）
// ・次のセクションの上端が「画面の上から START」に来たところから混ざり始め、
//   「画面の上から END」に来たところで、そのセクションの色になりきる
//   （前のセクションがほとんど見えなくなってから変わる）
// ・文字の色は各セクションの指定のまま（ここでは変えない）

// "#000" / "#000000" / "rgb(0, 0, 0)" を [r, g, b] に変換
const toRgb = (value) => {
  const v = value.trim()
  if (v.startsWith('#')) {
    let hex = v.slice(1)
    if (hex.length === 3) hex = [...hex].map((c) => c + c).join('')
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  }
  return (v.match(/\d+(\.\d+)?/g) || [0, 0, 0]).slice(0, 3).map(Number)
}

const START = 0.5 // 混ざり始める位置（画面の上から50%）
const END = 0.2 // 色が変わりきる位置（画面の上から20%）

const clamp01 = (n) => Math.min(1, Math.max(0, n))
const mix = (a, b, p) => a.map((v, i) => v + (b[i] - v) * p)

export const initBgChange = () => {
  const sections = [...document.querySelectorAll('.js-bg-section')]
    .map((el) => ({ el, color: toRgb(getComputedStyle(el).getPropertyValue('--bg-color') || '#000') }))
  if (!sections.length) return

  let last = ''
  const update = () => {
    const vh = window.innerHeight
    const maxScroll = document.documentElement.scrollHeight - vh
    let color = sections[0].color
    // 上から順に「次の色へどれだけ近づいたか（0〜1）」を重ねていく
    for (let i = 1; i < sections.length; i++) {
      const top = sections[i].el.getBoundingClientRect().top
      // ページの最後のほう（締めのビジュアルなど）は上端が END まで届かないので、
      // 一番下までスクロールした時点で変わりきるように、変わりきる位置を下げる
      const minTop = top - (maxScroll - window.scrollY) // 一番下までスクロールしたときの上端
      const endLine = Math.max(vh * END, minTop)
      const startLine = endLine + vh * (START - END)
      const p = clamp01((startLine - top) / (vh * (START - END)))
      if (p === 0) break
      color = mix(color, sections[i].color, p)
    }
    const value = `rgb(${color.map(Math.round).join(',')})`
    if (value !== last) {
      document.body.style.backgroundColor = value
      last = value
    }
  }

  onScroll(update)
  window.addEventListener('resize', update)
  update()
}
