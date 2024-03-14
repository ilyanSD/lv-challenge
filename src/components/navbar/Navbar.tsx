"use client";

import Image from 'next/image'
import React, { useState, useEffect, use, useCallback } from 'react'
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
        console.log("Error Occured", error);
      }
    }
  }

  const handleOpenModal = () => {
    if (isConnected) {
      handleSigning();
    } else {
      setModalOpen(true);
    }
  }

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, [])

  const { disconnectAsync } = useDisconnect();
  
  const handleSignout = async () => {
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
    if (isConnected) {
      setModalOpen(false);
    }
  }, [isConnected])

  return (
    <header className="h-[72px] flex justify-between w-full items-center">
      <span className="font-bold text-[18px] leading-[23.4px]">{
        pathname.startsWith('/dashboard') ? 'Dashboard' : 'Explore'
      }</span>

      {
        (status === 'loading' || isSigning && status !== 'authenticated') ? <PulseLoader color="#B958D6" size={6} /> :
          <>
            {
              !session ? 
              <button className="flex h-[40px] py-[6px] pr-[16px] pl-[12px] items-center gap-[8px] rounded-[32px] login-button" onClick={handleOpenModal}>
                <Image width={15.83} height={15.83} src="/login/diamond.svg" alt="Diamond" />
                <span className="text-[14px] leading-[18.2px] text-white font-semibold">Log in</span>
              </button> :
              <button className="flex h-[40px] py-[6px] pr-[16px] pl-[12px] items-center gap-[8px] rounded-[32px] login-button" onClick={handleSignout}>
                <Image width={15.83} height={15.83} src="/login/diamond.svg" alt="Diamond" />
                <span className="text-[14px] leading-[18.2px] text-white font-semibold">Log out</span>
              </button>
            } 
          </>
      }    

      <LogInModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </header>
  )
}

export default Navbar