import React from 'react';
import Button from '../Button';

export const IconButton = ({ Icon, label, isActive, onClick }) => (
  <>
    <span className="label">{label}</span>
    <Button
      size="small-square"
      variant={isActive ? 'primary' : 'dark'}
      onClick={onClick}
    >
      <Icon />
    </Button>
    <style jsx>{`
      .label {
        font-weight: 700;
        text-transform: uppercase;
        font-size: 12px;
      }
    `}</style>
  </>
);

export default IconButton;
