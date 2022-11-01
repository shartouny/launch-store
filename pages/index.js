import WebsiteFooter from '@components/footer/WebsiteFooter'
import WebsiteNav from '@components/navbar/WebsiteNav'
import Link from 'next/link'

export default function Index() {
  const whyChoseUs = [
    {
      title: 'Automated mockups :',
      image: '/icons/website-icons/why-chose-us/automated-mockups.svg',
      description: 'you won’t have to email back and forth with suppliers waiting to get a mockup,you are instantly presented with super realistic mockups to show to your clients.'
    },
    {
      title: 'One invoice solution :',
      image: '/icons/website-icons/why-chose-us/one-invoice-solution.svg',
      description: 'your account team will love you when you present to them one monthly invoice with the blank, the print, and the price all conveniently in one invoice.'
    },
    {
      title: 'Worldwide Production :',
      image: '/icons/website-icons/why-chose-us/worldwide-productions.svg',
      description: 'we have production facilities strategically located throughout the world.'
    },
    {
      title: 'Competitive Shipping Rates :',
      image: '/icons/website-icons/why-chose-us/competitive-shipping-rates.svg',
      description: 'since we ship out of millions of packages per year we get some of the best rates in the world and we pass the savings on to you.'
    },
    {
      title: 'Over 300+ different print on demand products :',
      image: '/icons/website-icons/why-chose-us/over-300-different-prints.svg',
      description: 'everything you need to meet all your customers needs. Automated Workflow.'
    },
    {
      title: 'No inventory required = no dead stock :',
      image: '/icons/website-icons/why-chose-us/no-inventory-required.svg',
      description: 'Stop having items linger in your warehouse for years, use print on demand to ensure nothing is wasted or stored.'
    },
    {
      title: 'Personalization (launching end of Q1 2022) :',
      image: '/icons/website-icons/why-chose-us/personalization.svg',
      description: 'the great resignation is here and companies have to do more to show their employees they care about them. Personalization is a great unique way to do this.'
    },
    {
      title: 'Pay with Points (launching end of Q1 2022) :',
      image: '/icons/website-icons/why-chose-us/pay-with-points.svg',
      description: 'use points instead of real money.'
    },
    {
      title: 'Automated shipping rules :',
      image: '/icons/website-icons/why-chose-us/automated-shipping-rules.svg',
      description: 'we set up all the shipping up for you automatically.'
    }
  ]
  const stepsOfInstallation = [
    {
      title: 'Step 1',
      description: 'Create a launch store account'
    },
    {
      title: 'Step 2',
      description: 'Create products for your store'
    },
    {
      title: 'Step 3',
      description: 'Present to client'
    },
    {
      title: 'Step 4',
      description: 'Invite employees to claim their swag.'
    }
  ]
  return (
    <div>
      <WebsiteNav />
      <div className="pb-5 sm:pb-0 bg-colorE5E5E5">
        <div className="container flex flex-col sm:flex-row px-4 lg:px-14 mx-auto">
          <div className="md:mt-32 w-full lg:w-2/3">
            <img src="/icons/website-icons/main.svg" alt="main-icon" />
          </div>
          <div className="mt-16 w-full lg:w-1/3">
            <div className="py-2 lg:text-lg xl:text-4xl font-extrabold uppercase text-md">Ecommerce Stores Made Exclusively For Distributors.</div>
            <div className="text-sm xl:text-lg font-light text-justify">We’ve spent the last three years making the perfect ecommerce system for distributors. We talked with thousands of promotional product agents to understand their pain points and what features or products will help you close every client you pitch. You should focus on what you do best, pitching clients, let us handle the rest. The first distributor ecommerce platform with a completely automated workflow for print on demand products. </div>
            {/* <div className="flex justify-center sm:justify-start pt-6">
              <button className={`text-white bg-black px-10 h-10   rounded-md font-semibold shadow-md `}>Learn More</button>
            </div> */}
          </div>
        </div>
      </div>
      <div className="container flex flex-col sm:flex-row px-4 lg:px-14 pt-14 pb-14 mx-auto">
        <div className="md:pt-16 w-full lg:w-1/2">
          <div className="w-full lg:w-4/5 xl:w-2/3">
            <div className="lg:text-lg xl:text-4xl font-extrabold text-md">HOW IT ALL STARTED</div>
            <div className="pt-4 text-sm xl:text-lg font-light text-justify xl:text-left">
              Launch has worked with thousands of ecommerce stores over the past 9 years we’ve been in business. <br />
              <br />
              We’ve helped these stores sell over $400,000,000 worth of merchandise and ship it all over the globe.
              <br />
              <br />
              We’re pioneers in print on demand and consistently pushing the boundaries of what was thought to be possible. From t-shirts, to plates, to drinkware, to canvas, and everything in between.{' '}
            </div>
          </div>
        </div>
        <div className="px-4 w-full lg:w-1/2 xl:w-1/3">
          <img src="/icons/website-icons/started.svg" alt="how-it-all-started-icon" className="ml-auto" />
        </div>
      </div>

      <div className="bg-colorE5E5E5">
        <div className="container px-4 lg:px-14 md:pt-24 mx-auto">
          <div className="pt-10 pb-5 lg:text-lg xl:text-4xl font-extrabold text-md">WHY CHOOSE US</div>
          <div className="flex flex-col sm:flex-row justify-between ">
            <div className="xl:w-2/5">
              <div className="mx-auto">
                {whyChoseUs.map((r, i) => {
                  return i < 5 ? (
                    <div key={r.title} className="grid grid-cols-12 gap-4 xl:gap-0 py-7 text-lg">
                      <div className="col-span-2">
                        <img src={r.image} alt={r.title} />
                      </div>
                      <div className="col-span-9">
                        <p className="text-sm xl:text-lg">
                          <strong>{r.title}</strong> <br />
                          {r.description}
                        </p>
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            </div>
            <div className="xl:w-2/5">
              {whyChoseUs.map((r, i) => {
                return i >= 5 ? (
                  <div key={r.title} className="grid grid-cols-12 gap-4 xl:gap-0 py-7 text-lg">
                    <div className="col-span-2">
                      <img src={r.image} alt={r.title} />
                    </div>
                    <div className="col-span-9">
                      <p className="text-sm xl:text-lg">
                        <strong>{r.title}</strong> <br />
                        {r.description}
                      </p>
                    </div>
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>
        <div className="w-full">
          <img src="/icons/website-icons/moon.svg" className="ml-auto" alt="moon-icon" />
        </div>
      </div>
      <div className="container flex flex-col sm:flex-row px-4 lg:px-14 pt-14 pb-14 mx-auto">
        <div className=" flex flex-col-reverse sm:flex-col w-full xl:w-1/2">
          <div className="">
            <div className="pt-10 sm:pt-0 lg:text-lg xl:text-4xl font-extrabold text-md">HOW IT WORKS</div>
            <div className="py-2 w-full sm:w-4/5 text-sm xl:text-lg font-light text-md">We’ve streamlined the process to the point where any rep can start a store, fill with products, and present to the client that same day. No intensive training required.</div>
          </div>
          <div className="md:pt-24">
            <img src="/icons/website-icons/how-it-works.svg" alt="how it-works-icon" />
          </div>
        </div>
        <div className="flex pt-8 sm:pt-0 w-full sm:w-1/2">
          <div className="sm:hidden w-1/4"></div>

          <div className="w-full">
            {stepsOfInstallation.map((r, i) => {
              return (
                <div key={'step' + i} className="">
                  <div className={`flex lg:text-lg xl:text-4xl text-md font-bold border-l-2 ${i != stepsOfInstallation.length - 1 ? ' border-black border-dashed' : ''}`}>
                    <div className="relative right-2.5">
                      <img src="/icons/website-icons/circle.svg" alt="circle-icon" />
                    </div>
                    <span className="pl-5">{r.title}</span>
                  </div>
                  <div className={`py-2 pl-10 ${i != stepsOfInstallation.length - 1 ? 'border-l-2 border-black border-dashed' : ''}`}>
                    <p className="text-sm xl:text-lg ">{r.description}</p>
                  </div>
                  <div className={i != stepsOfInstallation.length - 1 ? 'border-l-2 border-black border-dashed' : ''} style={{ height: '100px' }}></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className=" container px-4 sm:px-0 mx-auto">
        <div>
          <img src="/icons/website-icons/cloud.svg" alt="cloud-icon" />
        </div>
      </div>
      <div className="bg-colorE5E5E5">
        <div className="flex flex-col sm:flex-row lg:px-14">
          <div className="py-16 md:py-10 w-full sm:w-1/2">
            <img src="/icons/website-icons/pricing-model.svg" className="mx-auto" alt="pricing-model-icon" />
          </div>
          <div className="px-4 md:px-0 md:pt-60 w-full sm:w-1/2">
            <img src="/icons/website-icons/pricing.svg" alt="pricing-icon" />
          </div>
        </div>
      </div>

      <div className="pt-16 sm:pt-44 w-full">
        <div className="container px-4 lg:px-14 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center justify-xs-center">
            <div className="w-full md:w-1/2 lg:w-1/3 lg:text-lg xl:text-4xl font-bold text-center md:text-left">
              LAUNCH YOUR STORE TODAY
              <div className="flex w-full">
                <button className="px-4 mx-auto md:mx-0 mt-5 h-10 text-lg font-medium text-white bg-black rounded-md">
                  <Link href={process.env.NEXT_PUBLIC_TEELAUNCH_URL + '/integrations'}>Register Now</Link>
                </button>
              </div>
            </div>
            <div className="relative top-6">
              <img src="/icons/website-icons/footer.svg" alt="launch-icon-footer" />
            </div>
          </div>
        </div>
      </div>
      <WebsiteFooter />
    </div>
  )
}
