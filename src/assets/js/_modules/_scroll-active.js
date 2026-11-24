import { onScroll } from './_smooth-scroll'

// .active の要素が画面に入ったら .move を付ける（一度付いたら外さない）
// 判定位置：要素の上端が「画面の下から20%」の線より上に来たとき
// ・ページを開いた時点ですでに線より上にある要素にも付く
// ・ページ内リンクなどで一気に通り過ぎた場合にも付く（「線より上か」で判定しているため）
// ・中に画像がある要素は、画像の読み込みと表示準備が終わってから付ける
//   （回線が遅いと、空の枠のままアニメーションが終わり、
//     後から届いた画像がいきなり表示されてしまうため）

// 要素の中の画像が、すべて表示できる状態になるまで待つ
const waitImages = (el) => {
  const imgs = [...el.querySelectorAll('img')]
  return Promise.all(
    imgs.map((img) =>
      img
        .decode() // 読み込み＋表示準備が終わったら完了
        .catch(() => {}) // 読み込みに失敗しても、表示（.move）は止めない
    )
  )
}

export const initScrollActive = () => {
  let targets = [...document.querySelectorAll('.active')]
  if (!targets.length) return

  const check = () => {
    const line = window.innerHeight * 0.8
    targets = targets.filter((el) => {
      if (el.getBoundingClientRect().top < line) {
        waitImages(el).then(() => {
          // 閉じた状態を一度描画してから付ける（描画前に付くとアニメーションしないため）
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('move')))
        })
        return false // 付けたもの（付ける予定のもの）は以降の判定から外す
      }
      return true
    })
  }

  onScroll(check) // Lenis（なめらかスクロール）を使っている場合もスクロールのたびに判定
  window.addEventListener('resize', check)
  check()
}
