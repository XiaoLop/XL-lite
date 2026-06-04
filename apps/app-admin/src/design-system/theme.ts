import Aura from '@primevue/themes/Aura'
import { definePreset } from '@primevue/themes'
import { radius } from './tokens/radius'

export const theme = definePreset(Aura, {
  semantic: {
    borderRadius: radius.md,
  },
  components: {
    breadcrumb: {
      root: {
        padding: '0.5rem 1rem',
      },
    },
  },
})
