import React, { useState } from 'react';
import getDemoProps from '../lib/demoProps';
import PropTypes from 'prop-types';
import { Intro } from '../components/Prejoin/Intro';
import NotConfigured from '../components/Prejoin/NotConfigured';
import { useRouter } from 'next/router';
import Daily from '../components/Prejoin/Daily';
import Capsule from '../components/Capsule';
import moment from 'moment';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Index({ isConfigured = false, domain }) {
  const router = useRouter();
  const { width } = useWindowSize();

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const createRoom = async (startTime, duration, enableTranscription) => {
    setCreating(true);
    const res = await fetch('/api/createRoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nbf: moment(startTime).format(),
        expiryMinutes: Number(duration),
      }),
    });
    const resJson = await res.json();

    if (!resJson?.name) {
      setError(resJson?.error || true);
      return false;
    } else {
      await router.push(
        enableTranscription
          ? `/${resJson.name}?trans=true`
          : `/${resJson.name}`,
      );
    }
    setCreating(false);
  };

  return (
    <main>
      {width > 900 && <Daily />}
      <div className="intro">
        <div className="domain">
          <Capsule variant="gray">{domain}.daily.co</Capsule>
        </div>
        {!isConfigured ? (
          <NotConfigured />
        ) : (
          <Intro error={error} creating={creating} onCreate={createRoom} />
        )}
      </div>
      <div className="bg" />

      <style jsx>{`
        main {
          height: 100vh;
          display: grid;
          grid-template-columns: ${width > 900 ? '30%' : 'auto'} auto;
          background: var(--gray-wash);
        }
        .bg {
          position: absolute;
          right: 0;
          margin-left: auto;
          height: 100%;
          width: 100%;
          background: url('/assets/setup-bg.png') bottom right no-repeat;
          opacity: 0.1;
          z-index: 0;
        }
        .intro {
          display: grid;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          z-index: 100;
        }
        .domain {
          top: 20px;
          right: 20px;
          margin-left: auto;
          position: absolute;
        }
        .domain :global(.capsule) {
          padding: var(--spacing-xxxs);
          border-radius: 6px;
        }
      `}</style>
    </main>
  );
}

Index.propTypes = {
  isConfigured: PropTypes.bool.isRequired,
  domain: PropTypes.string.isRequired,
};

export async function getStaticProps() {
  const defaultProps = getDemoProps();
  return {
    props: defaultProps,
  };
}
