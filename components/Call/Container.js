import React, { useMemo } from 'react';
import { Audio } from '../Audio';
import { BasicTray } from '../Tray';
import { useParticipants } from '../../contexts/ParticipantsProvider';
import { useJoinSound } from '../../hooks/useJoinSound';
import PropTypes from 'prop-types';
import { WaitingRoom } from './WaitingRoom';

export const Container = ({ children }) => {
  const { isOwner } = useParticipants();

  useJoinSound();

  const roomComponents = useMemo(
    () => (
      <>
        {/* Show waiting room notification & modal if call owner */}
        {isOwner && <WaitingRoom />}
        {/* Tray buttons */}
        <BasicTray />
        {/* Audio tags */}
        <Audio />
      </>
    ),
    [isOwner],
  );

  return (
    <div className="room">
      {children}
      {roomComponents}

      <style jsx>{`
        .room {
          flex-flow: column nowrap;
          width: 100%;
          height: 100%;
          display: flex;
        }
      `}</style>
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node,
};

export default Container;
