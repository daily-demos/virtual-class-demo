import React from 'react';
import DeviceSelectModal from '../DeviceSelectModal/DeviceSelectModal';
import InviteOthersModal from '../Call/InviteOthersModal';
import CreatePollModal from '../Call/CreatePollModal';
import PollModal from '../Call/PollModal';
import PollResultModal from '../Call/PollResultModal';
import BackgroundEffectsModal from '../Call/BackgroundEffectModal';

export const Modals = () => {
  return (
    <>
      <DeviceSelectModal />
      <InviteOthersModal />
      <CreatePollModal />
      <PollModal />
      <PollResultModal />
      <BackgroundEffectsModal />
    </>
  );
};

export default Modals;
