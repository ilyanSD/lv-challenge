"use client";

import Image from 'next/image'
import React, { useState } from 'react'
import LogInModal from '@/components/web3/LogInModal'

const Navbar = () => {

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <header className="h-[72px] flex justify-between w-full items-center">
      <span className="font-bold text-[18px] leading-[23.4px]">Explore</span>
      <button className="flex h-[40px] py-[6px] pr-[16px] pl-[12px] items-center gap-[8px] rounded-[32px] login-button" onClick={handleOpenModal}>
        <Image width={15.83} height={15.83} src="/login/diamond.svg" alt="Diamond" />
        <span className="text-[14px] leading-[18.2px] text-white font-semibold">Log in</span>
      </button>

      <LogInModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </header>
  )
}

export default Navbar