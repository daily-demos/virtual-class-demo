import React, { useEffect, useMemo, useRef, useState } from 'react';
import Tile from '../Tile';
import { DEFAULT_ASPECT_RATIO } from '../../constants';
import { useParticipants } from '../../contexts/ParticipantsProvider';
import { useUIState } from '../../contexts/UIStateProvider';
import { useResize } from '../../hooks/useResize';
import { useScrollbarWidth } from '../../hooks/useScrollbarWidth';
import { throttle } from '../../lib/throttle';
import {
  useLocalParticipant,
  useNetwork,
  useScreenShare,
} from '@daily-co/daily-react-hooks';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { useActiveSpeaker } from '../../hooks/useActiveSpeaker';
import { useBlockScrolling } from './useBlockScrolling';

/**
 * Gap between tiles in pixels.
 */
const GAP = 1;

export const ParticipantBar = ({
  aspectRatio = DEFAULT_ASPECT_RATIO,
  fixed = [],
  others = [],
  width,
}) => {
  const { swapParticipantPosition } = useParticipants();
  const { pinnedId } = useUIState();
  const spaceBefore = useRef(null);
  const spaceAfter = useRef(null);
  const scrollRef = useRef(null);
  const othersRef = useRef(null);
  const [range, setRange] = useState([0, 20]);
  const [isSidebarScrollable, setIsSidebarScrollable] = useState(false);
  const blockScrolling = useBlockScrolling(scrollRef);
  const scrollbarWidth = useScrollbarWidth();
  const activeSpeakerId = useActiveSpeaker();
  const { screens } = useScreenShare();

  const hasScreenshares = useMemo(() => screens.length > 0, [screens]);
  const visibleOthers = useMemo(
    () => others.slice(range[0], range[1]),
    [others, range],
  );
  const localParticipant = useLocalParticipant();
  const { threshold } = useNetwork();

  /**
   * Determines whether to render the active speaker border.
   * Border should be omitted in 1-to-1 scenarios.
   */
  const shouldRenderSpeakerBorder = useMemo(
    () =>
      // Non-floating bar with at least 3 rendered participants
      fixed.length + others.length > 2 ||
      // Floating bar with more than 1 participant on shared screen
      (fixed.length > 1 && hasScreenshares),
    [fixed.length, hasScreenshares, others.length],
  );

  useResize(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    /**
     * No participant bar and/or no scroll area
     */
    setIsSidebarScrollable(scrollEl.scrollHeight > scrollEl.clientHeight);
  }, [scrollRef]);

  /**
   * Move out-of-view active speakers to position right after presenters.
   */
  useEffect(() => {
    const scrollEl = scrollRef.current;
    // Ignore promoting, when no screens are being shared
    // because the active participant will be shown in the SpeakerTile anyway
    if (!hasScreenshares || !scrollEl) return;

    const maybePromoteActiveSpeaker = () => {
      const fixedOtherId = fixed.find(
        id => id !== localParticipant?.session_id,
      );

      // Promote speaker when participant bar isn't rendered & screen is shared
      if (hasScreenshares && fixedOtherId) {
        swapParticipantPosition(fixedOtherId, activeSpeakerId);
        return;
      }

      // Ignore when speaker is already at first position or component unmounted
      if (!fixedOtherId || fixedOtherId === activeSpeakerId || !scrollEl)
        return;

      // Active speaker not rendered at all, promote immediately
      if (
        visibleOthers.every(id => id !== activeSpeakerId) &&
        activeSpeakerId !== localParticipant?.session_id
      ) {
        swapParticipantPosition(fixedOtherId, activeSpeakerId);
        return;
      }

      const activeTile = othersRef.current?.querySelector(
        `[id="${activeSpeakerId}"]`,
      );
      // Ignore when active speaker is not within "others"
      if (!activeTile) return;

      // Ignore when active speaker is already pinned
      if (activeSpeakerId === pinnedId) return;

      const { height: tileHeight } = activeTile.getBoundingClientRect();
      const othersVisibleHeight =
        scrollEl.clientHeight - othersRef.current?.offsetTop;

      const scrolledOffsetTop = activeTile.offsetTop - scrollEl.scrollTop;

      // Ignore when speaker is already visible (< 50% cut off)
      if (
        scrolledOffsetTop + tileHeight / 2 < othersVisibleHeight &&
        scrolledOffsetTop > -tileHeight / 2
      )
        return;

      swapParticipantPosition(fixedOtherId, activeSpeakerId);
    };
    maybePromoteActiveSpeaker();
    const throttledHandler = throttle(maybePromoteActiveSpeaker, 100);
    scrollEl.addEventListener('scroll', throttledHandler);
    return () => {
      scrollEl.removeEventListener('scroll', throttledHandler);
    };
  }, [
    activeSpeakerId,
    fixed,
    hasScreenshares,
    localParticipant?.session_id,
    pinnedId,
    swapParticipantPosition,
    visibleOthers,
  ]);

  const otherTiles = useMemo(
    () =>
      visibleOthers.map(id => (
        <Tile
          aspectRatio={aspectRatio}
          key={id}
          isSpeaking={shouldRenderSpeakerBorder && id === activeSpeakerId}
          sessionId={id}
        />
      )),
    [activeSpeakerId, aspectRatio, shouldRenderSpeakerBorder, visibleOthers],
  );

  if (fixed.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      className={classnames('sidebar', {
        blockScrolling,
        scrollable: isSidebarScrollable,
        scrollbarOutside: scrollbarWidth > 0,
      })}
    >
      <div className="fixed">
        {fixed.map((id, i) => {
          // reduce setting up & tearing down tiles as much as possible
          const key = i;
          return (
            <Tile
              key={key}
              aspectRatio={aspectRatio}
              sessionId={id}
              network={id === localParticipant?.sessionId ? threshold : null}
            />
          );
        })}
      </div>
      <div ref={othersRef} className="participants">
        <div ref={spaceBefore} style={{ width }} />
        {otherTiles}
        <div ref={spaceAfter} style={{ width }} />
      </div>
      <style jsx>{`
        .sidebar {
          border-left: 1px solid var(--blue-dark);
          flex: none;
          margin-left: 1px;
          overflow-x: hidden;
          overflow-y: auto;
        }
        .sidebar.blockScrolling {
          overflow-y: hidden;
        }
        .sidebar.blockScrolling.scrollbarOutside {
          background-color: red;
          padding-right: 12px;
        }
        .sidebar.scrollable:not(.scrollbarOutside) :global(.tile-actions) {
          right: 20px;
        }
        .sidebar .fixed {
          background: red;
          position: sticky;
          top: 0;
          z-index: 3;
        }
        .sidebar .participants {
          position: relative;
        }
        .sidebar :global(.tile) {
          border-top: ${GAP}px solid var(--blue-dark);
          width: ${width}px;
        }
        .sidebar .fixed :global(.tile:first-child) {
          border: none;
        }
      `}</style>
    </div>
  );
};

ParticipantBar.propTypes = {
  aspectRatio: PropTypes.number,
  fixed: PropTypes.array.isRequired,
  others: PropTypes.array.isRequired,
  width: PropTypes.number,
};

export default ParticipantBar;
