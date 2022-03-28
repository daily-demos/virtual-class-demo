import React from 'react';
import Image from 'next/image';

const Daily = () => {
  return (
    <div className="logo">
      <Image src="/assets/daily-logo-dark.svg" alt="Daily Logo" width="140px" height="52px" />
      <div className="content">
        <p>Some selling point here.</p>
        <p>Some selling point here.</p>
        <p>Some selling point here.</p>
        <p>Some selling point here.</p>
        <p>Some selling point here.</p>
      </div>
      <div className="footer">
        Read our <a href="https://docs.daily.co/">documentation</a>
      </div>
      <style jsx>{`
        .logo {
          padding: 2rem;
          background: white;
        }
        .logo .content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          top: 50%;
          transform: translateY(50%);
        }
        .logo .footer {
          position: absolute;
          bottom: 2rem;
          margin-top: auto;
        }
      `}</style>
    </div>
  )
};

export default Daily;