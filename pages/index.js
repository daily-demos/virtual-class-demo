import React, { useState, useCallback } from 'react';
import { AppStateProvider } from '../contexts/AppStateProvider';
import { CallProvider } from '../contexts/CallProvider';
import { ChatProvider } from '../contexts/ChatProvider';
import { MediaDeviceProvider } from '../contexts/MediaDeviceProvider';
import { ParticipantsProvider } from '../contexts/ParticipantsProvider';
import { TranscriptionProvider } from '../contexts/TranscriptionProvider';
import { UIStateProvider } from '../contexts/UIStateProvider';
import { WaitingRoomProvider } from '../contexts/WaitingRoomProvider';
import getDemoProps from '../lib/demoProps';
import PropTypes from 'prop-types';
import App from '../components/App';
import Intro from '../components/Prejoin/Intro';
import NotConfigured from '../components/Prejoin/NotConfigured';

/**
 * Index page
 * ---
 * - Checks configuration variables are set in local env
 * - Optionally obtain a meeting token from Daily REST API (./pages/api/token)
 * - Set call owner status
 * - Finally, renders the main application loop
 */
export default function Index({
  domain,
  isConfigured = false,
}) {
  const [roomName, setRoomName] = useState();
  const [token, setToken] = useState();
  const [tokenError, setTokenError] = useState();

  const getMeetingToken = useCallback(async (room, isOwner = false) => {
    if (!room) {
      return false;
    }
    // Fetch token from serverside method (provided by Next)
    const res = await fetch('/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomName: room, isOwner }),
    });
    const resJson = await res.json();

    if (!resJson?.token) {
      setTokenError(resJson?.error || true);
      return false;
    }

    console.log(`🪙 Token received`);

    setToken(resJson.token);

    // Setting room name will change ready state
    setRoomName(room);

    return true;
  }, []);

  const isReady = !!(isConfigured && roomName);

  if (!isReady) {
    return (
      <main>
        {(() => {
          if (!isConfigured) return <NotConfigured />;
          return (
            <Intro
              room={roomName}
              error={tokenError}
              domain={domain}
              onJoin={(room, isOwner) =>
                isOwner ? getMeetingToken(room, isOwner) : setRoomName(room)
              }
            />
          );
        })()}

        <style jsx>{`
          height: 100vh;
          display: grid;
          grid-template-columns: 760px;
          align-items: center;
          justify-content: center;
        `}</style>
      </main>
    );
  }

  /**
   * Main call UI
   */
  return (
    <UIStateProvider>
      <CallProvider
        domain={domain}
        room={roomName}
        token={token}
      >
        <ParticipantsProvider>
          <MediaDeviceProvider>
            <WaitingRoomProvider>
              <TranscriptionProvider>
                <ChatProvider>
                  <AppStateProvider>
                    <App />
                  </AppStateProvider>
                </ChatProvider>
              </TranscriptionProvider>
            </WaitingRoomProvider>
          </MediaDeviceProvider>
        </ParticipantsProvider>
      </CallProvider>
    </UIStateProvider>
  );
}

Index.propTypes = {
  isConfigured: PropTypes.bool.isRequired,
  domain: PropTypes.string,
};

export async function getStaticProps() {
  const defaultProps = getDemoProps();
  return {
    props: defaultProps,
  };
}
