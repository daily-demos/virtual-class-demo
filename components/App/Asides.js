import React from 'react';
import { NetworkAside, PeopleAside, ChatAside } from '../Aside';

export const Asides = () => {
  return (
    <>
      <PeopleAside />
      <NetworkAside />
      <ChatAside />
    </>
  );
};

export default Asides;
