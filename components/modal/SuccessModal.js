import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Button from '../button/Button'
import Icon from '../icons/icon'

const SuccessModal = ({ message, duration, isVisible, setIsVisible, redirectTo, buttonLabel, iconColor, onDismiss }) => {
  useEffect(() => {
    if (isVisible)
      setTimeout(() => {
        onDismiss()
      }, duration)
  }, [isVisible, duration, onDismiss])
  const router = useRouter()
  return isVisible ? (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-gray-transparent" onClick={!!setIsVisible ? () => setIsVisible(false) : () => {}}>
      <div className="flex fixed top-1/2 left-1/2 flex-col justify-between items-center py-8 w-96 lg:w-1/3 h-1/2 text-center bg-white rounded-sm shadow-lg transform -translate-x-1/2 -translate-y-1/2">
        <p className="w-96 text-3xl font-medium text-primary">{message}</p>
        <Icon color={iconColor} selectedIcon="Success" />
        <Button label={buttonLabel} click={!!redirectTo ? () => router.push(redirectTo) : () => {}} className="h-12" type="primary" />
      </div>
    </div>
  ) : null
}

export default SuccessModal
