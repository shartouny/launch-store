import Link from 'next/link'
import { useState } from 'react'

export default function WebsiteNav() {
  const [isopen, setIsOpen] = useState(false)

  return (
    <div>
      {/* WEB */}
      <div className="hidden lg:block px-4 lg:px-14 bg-colorE5E5E5">
        <div className="container mx-auto">
          <div className="flex justify-between items-center pt-10">
            <div>
              <img src="/icons/website-icons/launch-store-circular.svg" className="w-64 cursor-pointer" alt="launch-icon" />
            </div>
            <div className="flex justify-end w-1/3">
              {/* <div>About us</div> */}
              {/* <div>How it works</div> */}
              <div className="p-2">
                <Link href={`mailto:sales@launch.shop`}>Contact</Link>
              </div>
              <div className="p-2">
                <Link href={process.env.NEXT_PUBLIC_TEELAUNCH_URL + '/integrations'}>Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden shadow-md">
        <div className="flex justify-between items-center p-4">
          <div>
            <img src="/icons/website-icons/launch-store-circular.svg" className="w-1/2 cursor-pointer" alt="launch-icon" />
          </div>
          <div className="self-end" onClick={() => setIsOpen((prev) => !prev)}>
            {!isopen ? <img src="/icons/website-icons/burger.svg" alt="burger-icon" /> : <img src="/icons/website-icons/x.svg" alt="burger-icon" />}
          </div>
        </div>

        {isopen && (
          <div style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }} className="absolute right-3.5 w-32 bg-white">
            <div className="">
              {/* <div className="px-1"><div className="py-2 px-2 font-semibold border-b border-black cursor-pointer">About us</div></div> */}
              {/* <div className="px-1"><div className="py-2 px-2 font-semibold border-b border-black cursor-pointer">How it works</div></div> */}
              <div className="px-1">
                <div className="py-2 px-2 font-semibold cursor-pointer">Contact</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
