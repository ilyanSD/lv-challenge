import { useSession } from 'next-auth/react'
import React from 'react'
import Image from 'next/image'
import { CampaignPropsWithId } from '@/types/CampaignProps'

interface Props {
  campaign: CampaignPropsWithId,
  toggleFavourite: (id: string) => void,
  isFavourite: boolean
}

const Campaign: React.FC<Props> = ({ campaign, toggleFavourite, isFavourite }) => {

  const { data: session } = useSession()

  return (
    <div className='w-full gap-6 p-6 flex flex-col border border-[#F2F2F2] rounded-xl'>

      <div className='flex gap-4 rounded-xl items-center'>
        <img className='w-[48px] h-[48px] rounded-full' src={campaign.creator.profileImage} alt='Profile Picture'/>
        <div className='flex-grow'>
          <div className='flex gap-2'>
            <span className='leading-[20.8px] font-bold text-[16px]'>
              {campaign.creator.name}
            </span>
            <Image width={16} height={16} src='/dashboard/verified.svg' alt='Verified' />
          </div>
          <div className='leading-none'>
            <span className='mr-[8px] font-medium text-[12px] leading-[15.6px] opacity-40'>{campaign.rewardPot} ETH reward pot</span>
            <span className='font-medium text-[12px] leading-[15.6px] opacity-40 md:mr-2'>·</span>
            <span className='font-medium text-[12px] leading-[15.6px] opacity-40 block md:inline-block'>{campaign.claimedRewards} ETH Claimed rewards</span>
          </div>
        </div>
        <button className='w-[40px] h-[40px] bg-[#FFDE88] rounded-full flex items-center justify-center md:px-4 md:gap-2 md:rounded-[32px] md:w-auto' onClick={() => { toggleFavourite(campaign.id) }}>
          {
            !isFavourite ?
            <Image width={20} height={20} src='/dashboard/like.svg' alt='Like' /> :
            <Image width={8} height={8} src='/dashboard/dislike.svg' alt='Dislike' />
          }
          {
            !isFavourite ?
            <span className='hidden md:block font-semibold text-[13px] leading-[16.9px]'>
              Add to favourite
            </span> :
            <span className='hidden md:block font-semibold text-[13px] leading-[16.9px]'>
              Remove from favourite
            </span>
          }
        </button>
      </div>

      <span className='font-medium text-[16px] leading-6 whitespace-pre-line'>
        {campaign.campaignContent}
      </span>

      {/* Only if the campaign has media files */}

      <img className='w-full rounded-[12px]' src={campaign.campaignMedia} alt='' />

      <div className='flex gap-2 items-center'>
        <span className='font-medium text-[12px] leading-[15.6px] opacity-40'>
          30 Jan, 6:25 pm
        </span>
        <div className='flex gap-2 items-center'>
          <span className='font-medium text-[12px] leading-[15.6px] opacity-40'>
            ·
          </span>
          <div className='flex items-center gap-1'>
            <Image className='opacity-40' width={16} height={16} src='/dashboard/like.svg' alt='Like' />
            <span className='font-medium text-[12px] leading-[15.6px] opacity-40'>
              1.5k Likes
            </span>
          </div>
          <span className='font-medium text-[12px] leading-[15.6px] opacity-40'>
            128 Comments
          </span>
        </div>
        <div className='flex-grow flex items-center justify-end gap-1'>
          <Image className='' width={16} height={16} src='/dashboard/share.svg' alt='Share' />
          <span className='font-medium text-[12px] leading-[15.6px] opacity-40'>
            Open on X
          </span>
        </div>
      </div>
    </div>
  )
}

export default Campaign