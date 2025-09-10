/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-03 08:38:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-03 08:42:23
 * @Description: 文案复制
 */

export const useCopy = () => {
  const toast = useToast();
  const { copy, isSupported } = useClipboard()

  const copyText = async (text: string) => {
    if (!text) return

    if (!isSupported.value) {
      toast.add({
        title: '复制失败，当前浏览器不支持！',
        color: 'error',
        icon: 'ri:close-circle-line',
      })
      return
    }

    try {
      await copy(text)
      toast.add({
        title: '已复制！',
        color: 'success',
        icon: 'ri:checkbox-circle-line',
      })
    } catch (err) {
      toast.add({
        title: '复制失败，请手动复制!',
        color: 'error',
        icon: 'ri:close-circle-line',
      })
    }
  }

  return {
    copyText,
  }
}
