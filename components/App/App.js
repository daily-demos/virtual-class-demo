import React, { useMemo } from 'react';
import ExpiryTimer from '../ExpiryTimer';
import { useCallState } from '../../contexts/CallProvider';
import { useCallUI } from '../../hooks/useCallUI';

import PropTypes from 'prop-types';
import Room from '../Call/Room';
import { Asides } from './Asides';
import { Modals } from './Modals';

export const App = ({ customComponentForState }) => {
  const { state } = useCallState();

  const mainContent = useCallUI({
    state,
    room: <Room />,
    ...customComponentForState,
  });

  // Memoize children to avoid unnecessary renders from HOC
  return useMemo(
    () => (
      <>
        <div className="app">
          {mainContent()}
          <Modals />
          <Asides />
          <style jsx>{`
            color: white;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;

            .loader {
              margin: 0 auto;
            }
          `}</style>
        </div>
      </>
    ),
    [mainContent],
  );
};

App.propTypes = {
  customComponentForState: PropTypes.any,
};

export default App;
