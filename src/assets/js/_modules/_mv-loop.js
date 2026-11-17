// MV：2つのレイアウト（.mv-content_1 / .mv-content_2）をループで切り替える
// ページを開いた瞬間はどちらも非表示 → 開いた直後に mv-content_1 に is-active を付けてフェードイン → 以降ループ
// 1つのレイアウトを6秒表示し、その最初の0.5秒でフェードイン・最後の0.5秒でフェードアウトする
// （フェードの速さはCSSの transition: opacity .5s と合わせている：_mv.scss）
const DURATION = 6000
const FADE = 500

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time))

// 非表示の状態が一度描画されてから is-active を付ける（付けるのが早すぎるとフェードせずに表示されるため）
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

export const initMvLoop = () => {
  const contents = [...document.querySelectorAll('.mv-content')]
  if (!contents.length) return

  let current = 0

  const loop = async () => {
    await nextFrame()
    while (true) {
      // 最初の0.5秒でフェードイン → 表示 → 最後の0.5秒でフェードアウト
      contents[current].classList.add('is-active')
      await wait(DURATION - FADE)
      if (contents.length < 2) return
      contents[current].classList.remove('is-active')
      await wait(FADE)
      current = (current + 1) % contents.length
    }
  }

  loop()
}
