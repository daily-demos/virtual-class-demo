import React from 'react';
import Image from 'next/image';
import { ReactComponent as IconPoint } from '../../icons/point-sm.svg';

const IntroPoint = ({ children }) => {
  return (
    <div className="point">
      <IconPoint style={{ marginRight: '1rem' }} />
      <p>{children}</p>
      <style jsx>{`
        .point {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .point p {
          font-weight: var(--weight-regular);
          font-size: 18px;
          line-height: 100%;
        }
      `}</style>
    </div>
  );
};

const Daily = () => {
  return (
    <div className="logo">
      <a href="https://daily.co">
        <Image
          src="/assets/daily-logo-dark.svg"
          alt="Daily Logo"
          width="140px"
          height="52px"
        />
      </a>
      {/*<div className="content">*/}
      {/*  <IntroPoint>Some selling point here.</IntroPoint>*/}
      {/*  <IntroPoint>Some selling point here.</IntroPoint>*/}
      {/*  <IntroPoint>Some selling point here.</IntroPoint>*/}
      {/*  <IntroPoint>Some selling point here.</IntroPoint>*/}
      {/*  <IntroPoint>Some selling point here.</IntroPoint>*/}
      {/*  <IntroPoint>Some selling point here.</IntroPoint>*/}
      {/*</div>*/}
      <div className="footer">
        Read our <a href="https://docs.daily.co/">documentation</a>
      </div>
      <style jsx>{`
        .logo {
          padding: 2rem;
          background: white;
          z-index: 100;
        }
        .logo .content {
          display: flex;
          position: absolute;
          flex-direction: column;
          justify-content: center;
          top: 50%;
          transform: translateY(-50%);
        }
        .logo .footer {
          position: absolute;
          bottom: 2rem;
          margin-top: auto;
        }
      `}</style>
    </div>
  );
};

export default Daily;
