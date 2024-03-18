import React from 'react'

const HeartSVG = ({ strokeColor } : { strokeColor: string }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.7">
        <path d="M16.1643 3.99985C14.4384 3.99985 13.3539 4.85888 12.7341 5.61371C12.4422 5.96925 11.6542 5.96919 11.3623 5.61363C10.7426 4.85882 9.65817 3.99985 7.93189 3.99985C4.85404 3.99985 2.99988 6.93419 2.99988 9.35242C2.99988 12.5195 8.52587 16.9843 10.9409 18.7842C11.601 19.2763 12.4953 19.2764 13.1555 18.7844C15.5705 16.9848 21.0964 12.5212 21.0964 9.35314C21.0964 6.93419 19.2436 3.99985 16.1643 3.99985Z" stroke={strokeColor} strokeWidth="2.4" strokeLinecap="round"/>
      </g>
    </svg>

  );
};

export default HeartSVG;
