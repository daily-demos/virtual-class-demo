import React, { useCallback } from 'react';
import { Aside } from './Aside';
import { ReactComponent as IconCamOff } from '../../icons/camera-off-sm.svg';
import { ReactComponent as IconCamOn } from '../../icons/camera-on-sm.svg';
import { ReactComponent as IconMicOff } from '../../icons/mic-off-sm.svg';
import { ReactComponent as IconMicOn } from '../../icons/mic-on-sm.svg';
import { useParticipant } from '@daily-co/daily-react-hooks';
import PropTypes from 'prop-types';
import { useCallState } from '../../contexts/CallProvider';
import { useParticipants } from '../../contexts/ParticipantsProvider';
import { useUIState } from '../../contexts/UIStateProvider';
import Button from '../Button';

export const PEOPLE_ASIDE = 'people';

const PersonRow = ({ sessionId, isOwner = false }) => {
  const participant = useParticipant(sessionId);

  if (!participant) return null;
  return (
    <div className="person-row">
      <div className="name">
        {participant.user_name} {participant.local && '(You)'}
      </div>
      <div className="actions">
        {!isOwner ? (
          <>
            <span
              className={!participant.video ? 'state error' : 'state success'}
            >
              {!participant.video ? <IconCamOff /> : <IconCamOn />}
            </span>
            <span
              className={!participant.audio ? 'state error' : 'state success'}
            >
              {!participant.audio ? <IconMicOff /> : <IconMicOn />}
            </span>
          </>
        ) : (
          <>
            <Button
              size="tiny-square"
              disabled={!participant.video}
              variant={!participant.video ? 'error-light' : 'success-light'}
            >
              {!participant.video ? <IconCamOff /> : <IconCamOn />}
            </Button>
            <Button
              size="tiny-square"
              disabled={!participant.audio}
              variant={!participant.audio ? 'error-light' : 'success-light'}
            >
              {!participant.audio ? <IconMicOff /> : <IconMicOn />}
            </Button>
          </>
        )}
      </div>
      <style jsx>{`
        .person-row {
          display: flex;
          border-bottom: 1px solid var(--gray-light);
          padding-bottom: var(--spacing-xxxs);
          margin-bottom: var(--spacing-xxxs);
          justify-content: space-between;
          align-items: center;
          flex: 1;
        }

        .person-row .name {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .person-row .actions {
          display: flex;
          gap: var(--spacing-xxxs);
          margin-left: var(--spacing-xs);
        }

        .mute-state {
          display: flex;
          width: 24px;
          height: 24px;
          align-items: center;
          justify-content: center;
        }

        .state.error {
          color: var(--red-default);
        }
        .state.success {
          color: var(--green-default);
        }
      `}</style>
    </div>
  );
};
PersonRow.propTypes = {
  participant: PropTypes.object,
  isOwner: PropTypes.bool,
};

export const PeopleAside = () => {
  const { callObject } = useCallState();
  const { showAside, setShowAside } = useUIState();
  const { participantIds, isOwner, participantCount } = useParticipants();

  const muteAll = useCallback(
    deviceType => {
      if (!deviceType) {
        console.error('missing device type to mute');
        return;
      }
      const lcDeviceType = deviceType.toLowerCase();
      if (lcDeviceType !== 'audio' && lcDeviceType !== 'video') {
        console.error(
          `failed to recognize device type to mute (${deviceType})`,
        );
        return;
      }
      let updatedParticipantList = {};
      // Accommodate muting mics and cameras
      const newSetting =
        deviceType === 'video' ? { setVideo: false } : { setAudio: false };
      for (let id in callObject.participants()) {
        // Do not update the local participant's device (aka the instructor)
        if (id === 'local') continue;

        updatedParticipantList[id] = newSetting;
      }

      // Update all participants at once
      callObject.updateParticipants(updatedParticipantList);
    },
    [callObject],
  );

  const handleMuteAllAudio = () => muteAll('audio');
  const handleMuteAllVideo = () => muteAll('video');

  if (!showAside || showAside !== PEOPLE_ASIDE) {
    return null;
  }

  return (
    <Aside onClose={() => setShowAside(false)}>
      <div className="people-aside">
        {isOwner && (
          <div className="owner-actions">
            <Button
              fullWidth
              size="tiny"
              variant="outline-gray"
              onClick={handleMuteAllAudio}
            >
              Mute all mics
            </Button>
            <Button
              fullWidth
              size="tiny"
              variant="outline-gray"
              onClick={handleMuteAllVideo}
            >
              Mute all cams
            </Button>
          </div>
        )}
        <p className="info">
          {participantCount} {participantCount > 1 ? 'persons' : 'person'} in
          call
        </p>
        <div className="rows">
          {participantIds.map(p => (
            <PersonRow sessionId={p} key={p} isOwner={isOwner} />
          ))}
        </div>
        <style jsx>
          {`
            .people-aside {
              display: block;
            }
            .people-aside .info {
              font-weight: var(--weight-regular);
              font-size: 14px;
              color: #626262;
              padding: 0 var(--spacing-xxxs);
            }
            .owner-actions {
              display: flex;
              align-items: center;
              gap: var(--spacing-xxxs);
              margin: var(--spacing-xs) var(--spacing-xxs);
              flex: 1;
            }

            .rows {
              margin: var(--spacing-xxs);
              flex: 1;
            }
          `}
        </style>
      </div>
    </Aside>
  );
};

export default PeopleAside;
