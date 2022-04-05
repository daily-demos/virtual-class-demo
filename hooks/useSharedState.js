import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDaily, useDailyEvent } from '@daily-co/daily-react-hooks';

// @params initialValues - initial values of the shared state.
// @params broadcast - share the state with the other participants whenever the state changes.
export const useSharedState = ({ initialValues = {}, broadcast = true }) => {
  const daily = useDaily();
  const stateRef = useRef(null);
  const requestIntervalRef = useRef(null);

  const [state, setState] = useState({
    sharedState: initialValues,
    setAt: undefined,
  });

  // handling the app-message event, to check if the state is being shared.
  const handleAppMessage = useCallback(
    event => {
      // two types of events -
      // 1. Request shared state (request-shared-state)
      // 2. Set shared state (set-shared-state)
      switch (event.data?.message?.type) {
        // if we receive a request-shared-state message type, we check if the user has any previous state,
        case 'request-shared-state':
          // do not respond if there is no available state
          if (!stateRef.current.setAt) return;

          // if there is, we will send the shared-state to everyone in the call
          daily.sendAppMessage(
            {
              message: {
                type: 'set-shared-state',
                value: stateRef.current,
              },
            },
            '*',
          );
          break;
        // if we receive a set-shared-state message type then, we check the state timestamp with the local one and
        // we set the latest shared-state values into the local state.
        case 'set-shared-state':
          clearInterval(requestIntervalRef.current);
          // do not respond if the current state is more up-to-date than the state being shared
          if (
            stateRef.current.setAt &&
            new Date(stateRef.current.setAt) >
              new Date(event.data.message.value.setAt)
          ) {
            return;
          }
          // update the state
          setState(event.data.message.value);
          break;
      }
    },
    [stateRef, daily],
  );

  // whenever local user joins, we randomly pick a participant from the call and request him for the state.
  const handleJoinedMeeting = useCallback(() => {
    const randomDelay = 1000 + Math.ceil(1000 * Math.random());

    requestIntervalRef.current = setInterval(() => {
      const callObjectParticipants = daily.participants();
      const participants = Object.values(callObjectParticipants);
      const localParticipant = callObjectParticipants.local;

      if (participants.length > 1) {
        const remoteParticipants = participants.filter(
          p =>
            !p.local &&
            new Date(p.joined_at) < new Date(localParticipant.joined_at),
        );

        // avoid sending message if no remote participants are available
        if (remoteParticipants?.length === 0) return;

        const randomPeer =
          remoteParticipants[
            Math.floor(Math.random() * remoteParticipants.length)
          ];

        // send the request for the shared state
        daily.sendAppMessage(
          {
            message: {
              type: 'request-shared-state',
            },
          },
          randomPeer.user_id,
        );
      } else {
        // if there is only one participant, don't try to request shared state again
        clearInterval(requestIntervalRef.current);
      }
    }, randomDelay);

    setTimeout(() => clearInterval(requestIntervalRef.current), 10000);

    return () => clearInterval(requestIntervalRef.current);
  }, [daily]);

  // Add event listeners to the Daily call object if it exists
  useDailyEvent('app-message', handleAppMessage);
  useDailyEvent('joined-meeting', handleJoinedMeeting);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // setSharedState function takes in the state values :-
  // 1. shares the state with everyone in the call.
  // 2. set the state for the local user.
  const setSharedState = useCallback(
    values => {
      setState(state => {
        const currentValues =
          typeof values === 'function' ? values(state.sharedState) : values;

        const stateObj = {
          ...state,
          sharedState: currentValues,
          setAt: new Date(),
        };
        // if broadcast is true, we send the state to everyone in the call whenever the state changes.
        if (broadcast) {
          daily.sendAppMessage(
            {
              message: {
                type: 'set-shared-state',
                value: stateObj,
              },
            },
            '*',
          );
        }
        return stateObj;
      });
    },
    [broadcast, daily],
  );

  // returns the sharedState and the setSharedState function
  return { sharedState: state.sharedState, setSharedState };
};
