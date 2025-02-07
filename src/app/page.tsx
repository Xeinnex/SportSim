'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Home.module.css'; // Import the CSS Module
import { Button } from './button';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-32 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#161721] w-full h-screen">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full h-full flex justify-center items-center text-center">
        <Button>TEST</Button>
        <Button customProperty={true}>TEST</Button>
        
        <div
          className="w-96 h-96 bg-[#33ffcc] rounded-full flex justify-center items-center mx-auto"
          onMouseEnter={() => document.getElementById("movingBar")?.classList.add('move-line')}
          onMouseLeave={() => document.getElementById("movingBar")?.classList.remove('move-line')}
        >
          <span className="text-black font-[family-name:var(--font-geist-sans)] text-[18rem] select-none pointer-events-none">1</span>
        </div>

      </main>

      <footer className="fixed bottom-4 left-8 right-8 flex items-end justify-center z-20">
        {/* Bottom bar with padding */}
        <div
          className="absolute bottom-0 left-0 w-full h-[8px] bg-[#33ffcc] opacity-20 rounded-full"
        ></div>
        <div
          id="movingBar"
          className="absolute bottom-0 left-0 w-1/5 h-[8px] bg-[#33ffcc] rounded-full transition-all duration-1000 ease-in-out"
        ></div>
        <style>{`
          #movingBar {
            /* Ensures initial position */
            left: 0;
          }

          .move-line {
            /* Stop at 80% width, respecting the padding */
            left: 80% !important;
          }
        `}</style>
      </footer>
    </div>
  );
}
