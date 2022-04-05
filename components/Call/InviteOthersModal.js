import React from 'react';
import Button from '../Button';
import { TextInput } from '../Input';
import Modal from '../Modal';
import { useUIState } from '../../contexts/UIStateProvider';
import { Card, CardBody, CardHeader } from '../Card';
import { ReactComponent as IconTimer } from '../../icons/timer-md.svg';

export const INVITE_OTHERS_MODAL = 'invite';

export const InviteOthersModal = () => {
  const { currentModals, closeModal } = useUIState();

  return (
    <Modal
      isOpen={currentModals[INVITE_OTHERS_MODAL]}
      onClose={() => closeModal(INVITE_OTHERS_MODAL)}
    >
      <div className="invite-others">
        <h2 className="header">
          <IconTimer style={{ marginRight: '0.5rem' }} />
          Waiting for others to join?
        </h2>
        <div className="divider" />
        <div className="link">
          <div className="url">
            <TextInput value={window.location.href} disabled />
          </div>
          <Button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            Copy link
          </Button>
        </div>
      </div>
      <style jsx>{`
        .invite-others .header {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .invite-others .divider {
          position: relative;
          left: 50%;
          transform: translateX(-50%);
          margin: var(--spacing-md) 0;
          background: linear-gradient(90.03deg, #1be6b5 0%, #fb651e 101.71%);
          height: 6px;
          width: 64px;
        }
        .invite-others .link {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .invite-others .link .url {
          flex-grow: 1;
        }
      `}</style>
    </Modal>
  );
};

export default InviteOthersModal;
