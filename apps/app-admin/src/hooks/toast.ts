import type { ToastServiceMethods } from 'primevue/toastservice'

let toast: ToastServiceMethods | null = null
const life = 3000

export const showSuccess = (message: string, summary: string = 'Success') => {
  toast?.add({ severity: 'success', summary, detail: message, life })
}

export const showError = (message: string, summary: string = 'Error') => {
  toast?.add({ severity: 'error', summary, detail: message, life })
}

export const showInfo = (message: string, summary: string = 'Info') => {
  toast?.add({ severity: 'info', summary, detail: message, life })
}

export const showWarn = (message: string, summary: string = 'Warning') => {
  toast?.add({ severity: 'warn', summary, detail: message, life })
}

export const initToast = (val: ToastServiceMethods) => {
  toast = val
}
