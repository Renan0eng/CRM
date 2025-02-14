"use client"

import React from 'react';
import HomeSection1 from './home-section-1';
import HomeSection2 from './home-section-2';
import HomeSection3 from './home-section-3';
import HomeSection4 from './home-section-4';
import HomeSection5 from './home-section-5';
import HomeSection6 from './home-section-6';

type Props = {

}

export default function HomeView({ }: Props) {

  return (
    <main className='flex justify-center font-inter'>
      <div className='lg:w-2/3 h-full w-11/12 flex flex-col'>
        <div className=' gap-16 flex flex-col mt-32'>
          {/* apresentação */}
          {/* Section 1 */}
          <HomeSection1 />
          {/* Planos */}
          {/* section 5 */}
          <HomeSection5 />
          {/* vantagens */}
          {/* section 2 */}
          <HomeSection2 />
          {/* section 3 */}
          <HomeSection3 />
          {/* section 4 */}
          <HomeSection4 />
          {/* vantagem */}
          {/* section 6 */}
          <HomeSection6 />
        </div>
      </div>
    </main>
  )

}