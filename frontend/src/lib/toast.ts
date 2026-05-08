type ToastFn = (msg: string) => void

let _show: ToastFn | null = null

export function registerToast(fn: ToastFn) {
  _show = fn
}

export function unregisterToast() {
  _show = null
}

export function showToast(msg: string) {
  _show?.(msg)
}
