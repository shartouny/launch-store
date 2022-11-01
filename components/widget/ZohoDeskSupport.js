import { useEffect } from 'react'

const ZohoDeskSupport = ({ storeName }) => {
  useEffect(() => {
    const script = document.createElement('script')

    script.src = process.env.NEXT_PUBLIC_ZOHO_DESK_SCRIPT_URL
    script.defer = true
    script.async = true

    document.body.appendChild(script)
  }, [storeName])

  return <div></div>
}

export default ZohoDeskSupport
