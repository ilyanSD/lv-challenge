"use client";

import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import PulseLoader from 'react-spinners/PulseLoader';
import { usePathname } from 'next/navigation';

import LogInModal from '@/components/web3/LogInModal'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

import { SiweMessage } from 'siwe';
import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [pageTitle, setPageTitle] = useState("Explore");

  const { signMessageAsync } = useSignMessage();
  const { isConnected, address } = useAccount();

  const { data: session, status } = useSession();

  const pathname = usePathname();

  const handleSigning = async () => {
    if (!session && isConnected && status === 'unauthenticated') {
      try {
        setIsSigning(true);
        const message = new SiweMessage({
          domain: window.location.host,
          uri: window.location.origin,
          version: "1",
          address: address,
          statement: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
          nonce: await getCsrfToken(),
          chainId: 1,
        });
  
        const signedMessage = await signMessageAsync({
          message: message.prepareMessage(),
        });
  
        const response = await signIn("web3", {
          message: JSON.stringify(message),
          signedMessage,
          redirect: true,
          callbackUrl: '/dashboard'
        });
        if (response?.error) {
          console.log("Error occured:", response.error);
        }
  
      } catch (error) {
        setIsSigning(false);
        setModalOpen(false);
        console.log("Error Occured", error);
      }
    }
  }

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, [])

  const { disconnect } = useDisconnect();
  
  const handleSignout = async () => {
    try {
      if (isConnected) {
        disconnect();
      }
    } catch (error) {
      console.error("Error Occured", error);
    }
    signOut({callbackUrl:"/"});
  };

  useEffect(() => {
    switch (pathname) {
      case '/dashboard':
        setPageTitle('Dashboard');
        break;
      default:
        setPageTitle('Explore');
        break;
    }
  }, [pathname])

  useEffect(() => {
    if (address) {
      handleSigning();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  useEffect(() => {
    if (status === 'authenticated') {
      setModalOpen(false);
    }
  }, [status])

  return (
    <header className="h-[72px] flex justify-between w-full items-center">
      <span className="font-bold text-[18px] leading-[23.4px]">{pageTitle}</span>

      {
        (status === 'loading' || isSigning && status !== 'authenticated') ? <PulseLoader color="#B958D6" size={6} /> :
          <>
            {
              !session ? 
              <button className="flex h-[40px] py-[6px] pr-[16px] pl-[12px] items-center gap-[8px] rounded-[32px] login-button" onClick={handleOpenModal}>
                <Image width={15.83} height={15.83} src="/login/diamond.svg" alt="Diamond" />
                <span className="text-[14px] leading-[18.2px] text-white font-semibold">Log in</span>
              </button> :
              <button className="flex items-center gap-3 py-1 pr-4 pl-2 rounded-[32px] border border-[#E8E8E8] h-[40px] min-w-[210px]" onClick={handleSignout}>
                <img className='rounded-[40px] w-[24px] h-[24px]' src={session.user?.image!} alt="Profile Picture" />
                <span className="text-[14px] flex-grow text-start leading-[18.2px] font-semibold">{session.user?.name}</span>
                <Image width={24} height={24} src="/dropdown.svg" alt="Arrow" />
              </button>
            } 
          </>
      }    

      <LogInModal isOpen={isModalOpen} onClose={handleCloseModal} handleSigning={handleSigning} isWeb3Connected={isConnected} />
    </header>
  )
}

export default Navbar