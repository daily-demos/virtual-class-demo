import React from 'react';
import Image from 'next/image';
import { ReactComponent as IconPoint } from '../../icons/point-sm.svg';

const IntroPoint = ({ children }) => {
  return (
    <div>
      <IconPoint style={{ marginRight: '.5em' }} />
      <p>{children}</p>
      <style jsx>{`
        * {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  )
};

const Daily = () => {
  return (
    <div className="logo">
      <Image src="/assets/daily-logo-dark.svg" alt="Daily Logo" width="140px" height="52px" />
      <div className="content">
        <IntroPoint>Some selling point here.</IntroPoint>
        <IntroPoint>Some selling point here.</IntroPoint>
        <IntroPoint>Some selling point here.</IntroPoint>
        <IntroPoint>Some selling point here.</IntroPoint>
        <IntroPoint>Some selling point here.</IntroPoint>
        <IntroPoint>Some selling point here.</IntroPoint>
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