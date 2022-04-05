import React, { useMemo } from 'react';
import { IconButton } from '../IconButton';
import { useAppState } from '../../contexts/AppStateProvider';
import { useParticipants } from '../../contexts/ParticipantsProvider';
import { useTranscription } from '../../contexts/TranscriptionProvider';
import { ReactComponent as IconTalk } from '../../icons/talk-sm.svg';
import { ReactComponent as IconTranscription } from '../../icons/transcription-sm.svg';
import { ReactComponent as IconInvite } from '../../icons/invite-sm.svg';
import { useUIState } from '../../contexts/UIStateProvider';
import ExpiryTimer from '../ExpiryTimer';
import { useRoom } from '@daily-co/daily-react-hooks';
import Button from '../Button';
import { INVITE_OTHERS_MODAL } from './InviteOthersModal';

export const Header = () => {
  const { allowToTalk, setAllowToTalk } = useAppState();
  const { localParticipant } = useParticipants();
  const { isTranscribing, toggleTranscription, isTranscriptionEnabled } =
    useTranscription();
  const { openModal } = useUIState();
  const { config } = useRoom();

  return useMemo(
    () => (
      <header className="room-header">
        {config.exp !== 0 && <ExpiryTimer expiry={config.exp * 1000} />}
        {localParticipant?.owner && (
          <Button
            variant="header-dark"
            IconBefore={IconInvite}
            onClick={() => openModal(INVITE_OTHERS_MODAL)}
          >
            INVITE TO CLASS
          </Button>
        )}
        {localParticipant?.owner && (
          <div className="text-right">
            {isTranscriptionEnabled ? (
              <IconButton
                label="Show transcriptions"
                Icon={IconTranscription}
                isActive={isTranscribing}
                onClick={toggleTranscription}
              />
            ) : (
              <IconButton
                label="Transcription not supported on your domain"
                Icon={IconTranscription}
                onClick={() =>
                  window.open(
                    'https://docs.daily.co/reference/daily-js/events/transcription-events#main',
                  )
                }
              />
            )}
            <IconButton
              label="Allow students to talk"
              Icon={IconTalk}
              isActive={allowToTalk}
              onClick={setAllowToTalk}
            />
          </div>
        )}
        <style jsx>{`
          .room-header {
            display: flex;
            flex: 0 0 auto;
            column-gap: var(--spacing-xxs);
            box-sizing: border-box;
            padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-xxs)
              var(--spacing-sm);
            align-items: center;
            width: 100%;
          }

          .text-right {
            display: flex;
            flex: 0 0 auto;
            column-gap: var(--spacing-xxs);
            box-sizing: border-box;
            right: 0;
            margin-left: auto;
            align-items: center;
          }
        `}</style>
      </header>
    ),
    [
      allowToTalk,
      isTranscribing,
      isTranscriptionEnabled,
      localParticipant?.owner,
      setAllowToTalk,
      toggleTranscription,
      openModal,
      config.exp,
    ],
  );
};

export default Header;
