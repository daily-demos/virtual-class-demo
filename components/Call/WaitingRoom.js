import React from 'react';
import { WaitingRoomModal, WaitingRoomNotification } from '../WaitingRoom';
import { useWaitingRoom } from '../../contexts/WaitingRoomProvider';

export const WaitingRoom = () => {
  const { setShowModal, showModal } = useWaitingRoom();
  return (
    <>
      <WaitingRoomNotification />
      {showModal && <WaitingRoomModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default WaitingRoom;
