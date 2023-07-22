import { ref } from 'vue'

export default function useLoading(initValue = false) {
  const isLoading = ref(initValue)
  const setLoading = (value: boolean) => {
    isLoading.value = value
  }
  const toggle = () => {
    isLoading.value = !isLoading.value
  }
  return {
    isLoading,
    setLoading,
    toggle,
  }
}
