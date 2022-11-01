const Footer = () => {
  return (
    <>
      {/* WEB */}
      <div className="hidden md:block fixed bottom-0 z-50 w-full text-white bg-primary" style={{ height: '60px' }}>
        <div className="flex justify-between items-center font-bold" style={{ height: '100%' }}>
          <div className="pl-40 text-xs"></div>
          {/*<div className="pr-40 text-xs">*/}
          {/*  <span>Terms & Conditions</span>*/}
          {/*  <span className="pl-10">Privacy Policy</span>*/}
          {/*</div>*/}
        </div>
      </div>
      {/* MOBILE */}
      <div className="md:hidden lg:hidden xl:hidden fixed bottom-0 z-40 text-white bg-primary" style={{ width: '100%', height: '100px' }}>
        <div className="flex flex-col-reverse justify-around items-center font-bold" style={{ height: '100%' }}>
          <div className="" style={{ fontSize: '0.5rem', lineHeight: '0.75rem' }}></div>
          {/*<div className="text-xs">Terms & Conditions</div>*/}
          {/*<div className=" text-xs">Privacy Policy</div>*/}
        </div>
      </div>
    </>
  )
}

export default Footer
