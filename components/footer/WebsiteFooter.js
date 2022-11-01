// import Input from '../input/Input'

export default function WebsiteFooter() {
  return (
    <>
      {/* WEB */}

      <div className="hidden sm:block px-4 lg:px-14 text-white bg-black">
        <div className="container flex justify-between mx-auto w-full">
          <div className="py-10">
            <img src="/icons/website-icons/launch-store-circular-white.svg" className="w-64 cursor-pointer" alt="launch-icon" />
          </div>

          {/* <div className="flex justify-between items-center pb-5">
            <div className="flex ">
              <div className="font-bold">About</div>
              <div className="px-3 font-bold">Features</div>
              <div className="px-3 font-bold">Pricing</div>
              <div className="px-3 font-bold">Careers</div>
              <div className="px-3 font-bold">Help</div>
              <div className="px-3 font-bold">Privacy Policy</div>
            </div>
            <div className="w-1/3">
              <span className="text-3xl">STAY UP TO DATE</span>
              <div className="flex pt-3 text-sm ">
                <div className="w-2/3">
                  <Input placeholder="Your email address" className="px-2 w-full h-10 placeholder-black rounded-l-lg focus:outline-none" />
                </div>
                <div className="w-1/3">
                  <button className="w-full h-10 font-medium text-white bg-color21B6B2 rounded-r-lg">Join our newsletter</button>
                </div>
              </div>
            </div>
          </div> */}
          <div className="flex items-center py-10 mb-2 font-bold">
            <p>© Launch Shop LLC</p>
          </div>
        </div>
      </div>
      {/* MOBILE */}
      <div className="sm:hidden text-white bg-black">
        <div className="container flex flex-col mx-auto w-full">
          <div className="py-12 mx-auto">
            <img src="/icons/website-icons/launch-store-circular-white.svg" className="w-32 cursor-pointer" alt="launch-icon" />
          </div>
          {/* <div className="pb-5">
            <div className="flex pt-3 text-sm ">
              <div className="w-2/3">
                <Input placeholder="Your email address" className="px-2 w-full h-12 sm:h-10 placeholder-black rounded-l-lg focus:outline-none" />
              </div>
              <div className="w-1/3">
                <button className="w-full h-12 sm:h-10 font-medium text-white bg-color21B6B2 rounded-r-lg">Join our newsletter</button>
              </div>
            </div>
          </div>
          <div className="flex justify-center pb-3">
            <div className="font-bold">Privacy Policy</div>
          </div> */}
          <div className="mb-2 font-bold text-center">
            <p>© Launch Shop LLC</p>
          </div>
        </div>
      </div>
    </>
  )
}
