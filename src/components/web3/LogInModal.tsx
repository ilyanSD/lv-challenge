"use client";

import React from 'react'
import Image from 'next/image'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

import './web3.css'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogInModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {

  const { open } = useWeb3Modal()
  const { isConnected } = useAccount();

  if (!isOpen || isConnected) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 w-screen h-full z-10 flex justify-center modal-overlay">
      <div className="my-auto relative flex w-[351px] rounded-2xl modal-shadow bg-white lg:w-[860px] lg:h-[425px]">
        <div className="relative flex flex-col gap-12 p-6 lg:px-[63px] lg:pt-[82px] lg:pb-[91px] lg:w-[435px]">
          <div className="flex flex-col gap-3">
            <span className="text-[16px] lg:text-[24px] leading-[19.8px] lg:leading-[26.4px] font-semibold">
              Connect web3 wallet
            </span>
            <span className="font-medium text-[14px] leading-[18.2px] opacity-50">
              Link your wallet with your Matera profile and kick start your own economy.
            </span>
          </div>
          <div className="flex flex-col gap-[18px]">
            <button className="bg-black rounded-[56px] p-4 pl-[21px] flex items-center gap-2" onClick={() => { open() }}>
              <Image loading='eager' width={24} height={24} src="/web3/metamask.svg" alt='Metamask' />
              <span className="text-white font-semibold text-[14px] leading-[22.4px] flex-grow text-start">Connect Metamask</span>
              <Image loading='eager' width={24} height={24} src="/web3/arrow.svg" alt='Arrow' />
            </button>
            <button className="bg-black rounded-[56px] p-4 pl-[21px] flex items-center gap-2" onClick={() => { open() }}>
              <Image loading='eager' width={24} height={24} src="/web3/walletconnect.svg" alt='WalletConnect' />
              <span className="text-white font-semibold text-[14px] leading-[22.4px] flex-grow text-start">Connect WalletConnect</span>
              <Image loading='eager' className="" width={24} height={24} src="/web3/arrow.svg" alt='Arrow' />
            </button>
          </div>
        </div>
        <div className="hidden lg:block">
          <Image loading='eager' className="rounded-r-2xl" width={425} height={425} src="/web3/zuckerberg-quest.png" alt="Zuckerberg-Quest" />
        </div>
        <button className="absolute top-6 right-6 bg-black w-6 h-6 rounded-full flex items-center justify-center p-2" onClick={onClose}>
          <Image loading='eager' width={8} height={8} src="/web3/close-modal.svg" alt='Close' />
        </button>
      </div>
    </div>
  )
}

export default LogInModal