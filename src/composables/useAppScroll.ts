/**
 * 全站主滚动（AppLayout 内 vue-scroll）引用与滚动辅助
 */
import { shallowRef } from 'vue'

export type AppScrollInstance = {
  scrollTo: (
    position: { x?: number | string; y?: number | string },
    speed?: number,
  ) => void
  scrollBy: (
    delta: { x?: number | string; y?: number | string },
    speed?: number,
  ) => void
  scrollIntoView: (elm: Element | string, animate?: boolean) => void
  getPosition: () => { scrollTop?: number; scrollLeft?: number }
  refresh: () => void
  $el: HTMLElement
}

const appScrollRef = shallowRef<AppScrollInstance | null>(null)

export function useAppScroll() {
  return {
    appScrollRef,
    setAppScroll(instance: AppScrollInstance | null) {
      appScrollRef.value = instance
    },
    scrollToTop(speed = 0) {
      appScrollRef.value?.scrollTo({ y: 0 }, speed)
    },
    /**
     * 滚到任意后代元素（原生 scrollIntoView 在 body 锁死后会落到 vue-scroll 面板上；
     * 若面板未就绪则按相对位置计算后 scrollTo）。
     */
    scrollToElement(
      el: HTMLElement,
      options?: {
        block?: 'start' | 'center'
        offset?: number
        speed?: number
      },
    ) {
      const vs = appScrollRef.value
      const block = options?.block ?? 'start'
      const speed = options?.speed ?? 300
      const offset = options?.offset ?? 0

      if (!vs?.$el) {
        el.scrollIntoView({
          behavior: speed > 0 ? 'smooth' : 'auto',
          block,
        })
        return
      }

      const panel = vs.$el.querySelector('.__panel') as HTMLElement | null
      if (!panel) {
        el.scrollIntoView({
          behavior: speed > 0 ? 'smooth' : 'auto',
          block,
        })
        return
      }

      const panelRect = panel.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const { scrollTop = panel.scrollTop } = vs.getPosition()
      let y = elRect.top - panelRect.top + scrollTop

      if (block === 'center') {
        y -= (panelRect.height - elRect.height) / 2
      } else {
        y -= offset
      }

      vs.scrollTo({ y: Math.max(0, y) }, speed)
    },
  }
}
