/**
 * vuescroll（关键词亦作 vuescrollbar）全局注册与默认配置
 */
import type { App } from 'vue'
import type { Config } from 'vuescroll'
import vuescroll from 'vuescroll'

/** 全站主滚动 / 纵向区域默认配置 */
export const appScrollOps: Config = {
  vuescroll: {
    mode: 'native',
    sizeStrategy: 'percent',
    detectResize: true,
  },
  scrollPanel: {
    scrollingX: false,
    scrollingY: true,
    speed: 300,
  },
  rail: {
    background: 'transparent',
    opacity: 0,
    size: '6px',
    gutterOfSide: '2px',
  },
  bar: {
    background: 'color-mix(in srgb, var(--p-text-muted-color, #64748b) 55%, transparent)',
    opacity: 0.9,
    size: '6px',
    onlyShowBarOnScroll: true,
    keepShow: false,
    minSize: 0.15,
  },
}

/** 横向滚动条（分类条、热力图等）：父级需有明确高度 */
export const horizontalScrollOps: Config = {
  vuescroll: {
    mode: 'native',
    sizeStrategy: 'percent',
    detectResize: true,
  },
  scrollPanel: {
    scrollingX: true,
    scrollingY: false,
    speed: 300,
  },
  rail: {
    background: 'transparent',
    opacity: 0,
    size: '4px',
    gutterOfSide: '0',
  },
  bar: {
    background: 'color-mix(in srgb, var(--p-text-muted-color, #64748b) 55%, transparent)',
    opacity: 0.85,
    size: '4px',
    onlyShowBarOnScroll: true,
    keepShow: false,
    minSize: 0.12,
  },
}

export function setupVuescroll(app: App) {
  // 官方类型未声明 Vue3 的 ops/name 选项，按文档传入
  ;(vuescroll as unknown as { install: (app: App, opts?: object) => void }).install(
    app,
    {
      ops: appScrollOps,
      name: 'vue-scroll',
    },
  )
}
