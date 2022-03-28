import React, { useState } from 'react';
import getDemoProps from '../lib/demoProps';
import PropTypes from 'prop-types';
import { Intro } from '../components/Prejoin/Intro';
import NotConfigured from '../components/Prejoin/NotConfigured';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Daily from '../components/Prejoin/Daily';

export default function Index({
  isConfigured = false,
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const createRoom = async (startTime, duration) => {
    setCreating(true);
    const res = await fetch('/api/createRoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nbf: startTime, expiryMinutes: Number(duration) }),
    });
    const resJson = await res.json();

    if (!resJson?.name) {
      setError(resJson?.error || true);
      return false;
    } else {
      await router.push(`/${resJson.name}`);
    }
    setCreating(false);
  };

  return (
    <main>
      <Daily />
      <div className="intro">
        {(() => {
          if (!isConfigured) return <NotConfigured />;
          return <Intro error={error} creating={creating} onCreate={createRoom} />;
        })()}
      </div>

      <style jsx>{`
        main {
          height: 100vh;
          display: grid;
          grid-template-columns: 600px auto;
          background: #E5E5E5;
        }
        .intro {
          display: grid;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }
      `}</style>
    </main>
  );
}

Index.propTypes = {
  isConfigured: PropTypes.bool.isRequired,
};

export async function getStaticProps() {
  const defaultProps = getDemoProps();
  return {
    props: defaultProps,
  };
}
