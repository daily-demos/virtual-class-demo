import React from 'react';
import { TextInput } from '../Input';
import Button from '../Button';

export const ClipboardButton = ({ value }) => {
  return (
    <div className="clipboard-button">
      <TextInput value={value} disabled />
      <Button
        variant="clipboard"
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      >
        COPY
      </Button>
      <style jsx>{`
        .clipboard-button {
          display: flex;
        }
        .clipboard-button :global(.input-container) {
          flex-grow: 1;
        }
        .clipboard-button :global(.input-container input) {
          border-right: none;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      `}</style>
    </div>
  );
};

export default ClipboardButton;
