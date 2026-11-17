import { onScroll } from './_smooth-scroll'

// .active の要素が画面に入ったら .move を付ける（一度付いたら外さない）
// 判定位置：要素の上端が「画面の下から20%」の線より上に来たとき
// ・ページを開いた時点ですでに線より上にある要素にも付く
// ・ページ内リンクなどで一気に通り過ぎた場合にも付く（「線より上か」で判定しているため）
export const initScrollActive = () => {
  let targets = [...document.querySelectorAll('.active')]
  if (!targets.length) return

  const check = () => {
    const line = window.innerHeight * 0.8
    targets = targets.filter((el) => {
      if (el.getBoundingClientRect().top < line) {
        el.classList.add('move')
        return false // 付いたものは以降の判定から外す
      }
      return true
    })
  }

  onScroll(check) // Lenis（なめらかスクロール）を使っている場合もスクロールのたびに判定
  window.addEventListener('resize', check)
  check()
}
