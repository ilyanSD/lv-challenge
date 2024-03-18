"use client";

import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import HeartSVG from '@/components/dashboard/icons/Heart';
import FeedSVG from '@/components/dashboard/icons/Feed';
import Campaign from '@/components/dashboard/Campaign';
import { CampaignPropsWithId } from '@/types/CampaignProps';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { RotateLoader } from 'react-spinners';

const Dashboard = () => {
  const [isFeedActive, setIsFeedActive] = useState(true);
  const [isFavouritesActive, setIsFavouritesActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();

  const [campaigns, setCampaigns] = useState<CampaignPropsWithId[]>([]);
  const [favourites, setFavourites] = useState<String[]>([]);

  const toggleFavourite = useCallback((id: string) => {
    if (status === 'authenticated') {
      if (favourites.includes(id)) {
        axios.post('/api/campaigns/favourites/remove', { id, userId: session?.user.id }).then(() => {
          setFavourites(favourites.filter((favourite) => favourite !== id));
        });
      } else {
        axios.post('/api/campaigns/favourites/add', { id, userId: session?.user.id }).then(() => {
          setFavourites([...favourites, id]);
        });
      }
    }
  }, [favourites, session?.user.id, status]);

  const handleFeedClick = useCallback(() => {
    setIsFeedActive(true);
    setIsFavouritesActive(false);
  }, []);

  const handleFavouritesClick = useCallback(() => {
    setIsFeedActive(false);
    setIsFavouritesActive(true);
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      axios.get('/api/campaigns').then((response) => {
        setCampaigns(response.data);
        setLoading(false);
      });
    };

    const getFavourites = async () => {
      axios.get(`/api/campaigns/favourites?id=${session?.user.id}`).then((response) => {
        setFavourites(response.data);
      });
    };

    if (status === 'authenticated') {
      setLoading(true);
      fetchCampaigns();
      getFavourites();
    }
  }, [status, session?.user.id]);

  return (
    <main className="flex flex-col w-full gap-4 md:px-0 md:mx-0 mt-[24px] pb-[120px]">

      {/* FEED | FAVOURITES on >= medium screens */}

      <div className="flex justify-between items-center gap-4 h-[40px]">
        <div className="hidden md:flex flex-grow gap-4 justify-start">
          <button className={`flex items-center py-2 px-3 gap-2 rounded-[9px] ${isFeedActive && 'bg-[#579274]'}`} onClick={handleFeedClick}>
            <FeedSVG strokeColor={`${isFeedActive ? 'white' : 'black'}`} />
            <span className={`font-medium text-[13px] leading-[20.8px] ${isFeedActive ? 'text-white' : 'text-black'}`}>Feed</span>
          </button>
          <button className={`flex items-center py-2 px-3 gap-2 rounded-[9px] ${isFavouritesActive && 'bg-[#579274]'}`} onClick={handleFavouritesClick}>
            <HeartSVG strokeColor={`${isFavouritesActive ? 'white' : 'black'}`} />
            <span className={`font-medium text-[13px] leading-[20.8px] ${isFavouritesActive ? 'text-white' : 'text-black'}`}>Favourites</span>
          </button>
        </div>
        <div className='flex w-full md:w-[230px] h-full gap-3 rounded-[32px] py-1 pr-4 pl-2 border border-[#E8E8E8]'>
          <Image width={24} height={24} src='/dashboard/search.svg' alt='Search' />
          <input className='outline-none font-medium text-[14px] leading-[18.2px] flex-grow' type='text' placeholder="Search tags and people..." />
        </div>
      </div>

      {/* FOLLOWERS | FOLLOWING | FAVOURITES */}

      {isFeedActive && 
        <div className='flex justify-between p-6 gap-6 rounded-xl border border-[#F2F2F2]'>
          <div className='flex flex-col flex-grow items-center gap-3'>
            <span className='font-bold text-[18px] leading-[23.4px]'>44</span>
            <span className='font-medium text-[14px] leading-[18.2px] opacity-40'>Followers</span>
          </div>
          <div className='w-[1px] h-[53px] bg-[#E8E8E8]'></div>
          <div className='flex flex-col flex-grow items-center gap-3'>
            <span className='font-bold text-[18px] leading-[23.4px]'>75</span>
            <span className='font-medium text-[14px] leading-[18.2px] opacity-40'>Following</span>
          </div>
          <div className='w-[1px] h-[53px] bg-[#E8E8E8]'></div>
          <div className='flex flex-col flex-grow items-center gap-3'>
            <span className='font-bold text-[18px] leading-[23.4px]'>{favourites.length}</span>
            <span className='font-medium text-[14px] leading-[18.2px] opacity-40'>Favourites</span>
          </div>
        </div>
      }

      {/* CAMPAIGNS */}

      {
        loading ? 
        <div className='flex justify-center items-center h-[200px]'>
          <RotateLoader color="#B958D6" size={6} />
        </div> : (
        status === 'authenticated' && isFeedActive ? 
          campaigns.map((campaign) => (
            <Campaign campaign={campaign} isFavourite={favourites.includes(campaign.id)} toggleFavourite={toggleFavourite} key={campaign.id} />
          )) : campaigns.map((campaign) => {
            if (favourites.includes(campaign.id)) {
              return <Campaign campaign={campaign} isFavourite={true} toggleFavourite={toggleFavourite} key={campaign.id} />
            }
          })
        )
      }

      {/* Fixed FEED | FAVOURITES on < medium screens */}

      <div className="flex md:hidden p-3 bg-[#333333] border-t border-white border-opacity-30 fixed w-full left-0 bottom-0">
        <button className={`flex justify-center flex-grow items-center py-2 px-6 gap-2 rounded-[9px] ${isFeedActive && 'bg-[#579274]'}`} onClick={handleFeedClick}>
          <FeedSVG strokeColor='white' />
          <span className='font-medium text-[13px] leading-[20.8px] text-white'>Feed</span>
        </button>
        <button className={`flex justify-center flex-grow items-center py-2 px-3 gap-2 rounded-[9px] ${isFavouritesActive && 'bg-[#579274]'}`} onClick={handleFavouritesClick}>
          <HeartSVG strokeColor='white' />
          <span className='font-medium text-[13px] leading-[20.8px] text-white'>Favourites</span>
        </button>
      </div>
    </main>
  );
};

export default Dashboard;
