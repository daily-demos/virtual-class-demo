import React from 'react';
import Button from '../Button';
import { TextInput } from '../Input';
import Modal from '../Modal';
import { useUIState } from '../../contexts/UIStateProvider';

export const INVITE_OTHERS_MODAL = 'invite';

export const InviteOthersModal = () => {
  const { currentModals, closeModal } = useUIState();

  return (
    <Modal
      title="Invite others"
      isOpen={currentModals[INVITE_OTHERS_MODAL]}
      onClose={() => closeModal(INVITE_OTHERS_MODAL)}
    >
      <div className="invite-wrapper">
        <div className="invite-others">
          <div className="link">
            <TextInput value={window.location.href} disabled />
            <Button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Copy link
            </Button>
          </div>
        </div>
        <style jsx>{`
        .link {
          display: flex;
          justify-content: center;
          gap: 10px;
          width: 100%;
          height: 100%;
        }
      `}</style>
      </div>
    </Modal>
  )
}

export default InviteOthersModal;