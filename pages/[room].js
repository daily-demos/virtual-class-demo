import React, { useState, useCallback } from 'react';
import { AppStateProvider } from '../contexts/AppStateProvider';
import { CallProvider } from '../contexts/CallProvider';
import { ChatProvider } from '../contexts/ChatProvider';
import { MediaDeviceProvider } from '../contexts/MediaDeviceProvider';
import { ParticipantsProvider } from '../contexts/ParticipantsProvider';
import { TranscriptionProvider } from '../contexts/TranscriptionProvider';
import { UIStateProvider } from '../contexts/UIStateProvider';
import { WaitingRoomProvider } from '../contexts/WaitingRoomProvider';
import { PollProvider } from '../contexts/PollProvider';
import getDemoProps from '../lib/demoProps';
import PropTypes from 'prop-types';
import App from '../components/App';
import IntroRole from '../components/Prejoin/IntroRole';
import { useRouter } from 'next/router';
import Daily from '../components/Prejoin/Daily';
import Capsule from '../components/Capsule';

export default function Room({ domain, isConfigured = false }) {
  const router = useRouter();
  const { room } = router.query;

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
        <Daily />
        <div className="intro">
          <div className="domain">
            <Capsule variant="gray">{domain}.daily.co</Capsule>
          </div>
          <IntroRole
            room={room}
            error={tokenError}
            domain={domain}
            onJoin={isOwner =>
              isOwner ? getMeetingToken(room, isOwner) : setRoomName(room)
            }
          />
        </div>

        <style jsx>{`
          main {
            height: 100vh;
            display: grid;
            grid-template-columns: 600px auto;
            background: var(--gray-wash);
          }
          .intro {
            display: grid;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
          }
          .domain {
            top: 20px;
            right: 20px;
            margin-left: auto;
            position: absolute;
          }
        `}</style>
      </main>
    );
  }

  /**
   * Main call UI
   */
  return (
    <UIStateProvider>
      <CallProvider domain={domain} room={roomName} token={token}>
        <ParticipantsProvider>
          <MediaDeviceProvider>
            <WaitingRoomProvider>
              <TranscriptionProvider>
                <ChatProvider>
                  <AppStateProvider>
                    <PollProvider>
                      <App />
                    </PollProvider>
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

Room.propTypes = {
  isConfigured: PropTypes.bool.isRequired,
  domain: PropTypes.string,
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps() {
  const defaultProps = getDemoProps();
  return {
    props: defaultProps,
  };
}
