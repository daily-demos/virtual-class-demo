import React, { useState, useMemo, useEffect, useRef } from 'react';
import Tile from '../Tile';
import { DEFAULT_ASPECT_RATIO } from '../../constants';
import { useParticipants } from '../../contexts/ParticipantsProvider';
import { useDeepCompareMemo } from 'use-deep-compare';
import { Card, CardBody, CardHeader } from '../Card';
import { TextInput } from '../Input';
import Button from '../Button';

/**
 * Basic unpaginated video tile grid, scaled by aspect ratio
 *
 * Note: this component is designed to work with automated track subscriptions
 * and is only suitable for small call sizes as it will show all participants
 * and not paginate.
 *
 * Note: this grid does not show screenshares (just participant cams)
 *
 * Note: this grid does not sort participants
 */
export const VideoGrid = React.memo(
  () => {
    const containerRef = useRef();
    const { participantCount, orderedParticipantIds, localParticipant } =
      useParticipants();
    const [dimensions, setDimensions] = useState({
      width: 1,
      height: 1,
    });

    // Keep a reference to the width and height of the page, so we can repack
    useEffect(() => {
      if (!containerRef.current) return;

      let frame;
      const handleResize = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const dims = containerRef.current?.getBoundingClientRect();
          if (dims?.width && dims?.height) {
            setDimensions({
              width: Math.floor(dims.width),
              height: Math.floor(dims.height),
            });
          }
        });
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }, [containerRef]);

    const [tileWidth, tileHeight] = useMemo(() => {
      const width = Math.floor(dimensions.width);
      const height = Math.floor(dimensions.height);
      const tileCount = participantCount || 0;
      if (tileCount === 0) return [width, height];
      const dims = [];
      /**
       * We'll calculate the possible tile dimensions for 1 to n columns.
       */
      for (let columnCount = 1; columnCount <= tileCount; columnCount++) {
        // Pixels used for flex gap between tiles
        const columnGap = columnCount - 1;
        let maxWidthPerTile = Math.floor((width - columnGap) / columnCount);
        let maxHeightPerTile = Math.floor(
          maxWidthPerTile / DEFAULT_ASPECT_RATIO,
        );
        const rowCount = Math.ceil(tileCount / columnCount);
        const rowGap = rowCount - 1;
        if (rowCount * maxHeightPerTile + rowGap > height) {
          maxHeightPerTile = Math.floor((height - rowGap) / rowCount);
          maxWidthPerTile = Math.floor(maxHeightPerTile * DEFAULT_ASPECT_RATIO);
          dims.push([maxWidthPerTile, maxHeightPerTile]);
        } else {
          dims.push([maxWidthPerTile, maxHeightPerTile]);
        }
      }
      return dims.reduce(
        ([rw, rh], [w, h]) => {
          if (w * h < rw * rh) return [rw, rh];
          return [w, h];
        },
        [0, 0],
      );
    }, [dimensions.height, dimensions.width, participantCount]);

    const visibleParticipants = useMemo(
      () => [localParticipant.session_id, ...orderedParticipantIds],
      [localParticipant.session_id, orderedParticipantIds],
    );

    // Memoize our tile list to avoid unnecessary re-renders
    const tiles = useDeepCompareMemo(
      () =>
        visibleParticipants.map(p => (
          <Tile
            sessionId={p}
            key={p}
            mirrored
            style={{ maxWidth: tileWidth, maxHeight: tileHeight }}
          />
        )),
      [tileWidth, tileHeight, visibleParticipants],
    );

    if (!visibleParticipants.length) {
      return null;
    }

    return (
      <div className="video-grid" ref={containerRef}>
        <div className="tiles">{tiles}</div>
        {participantCount < 2 && (
          <div className="tiles">
            <div className="invite-others">
              <Card variant="dark">
                <CardHeader>Waiting for others to join?</CardHeader>
                <CardBody>
                  <h3>Copy the link and invite them to the call!</h3>
                  <div className="link">
                    <div className="url">
                      <TextInput
                        variant="border"
                        value={window.location.href}
                        disabled
                      />
                    </div>
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(window.location.href)
                      }
                    >
                      Copy link
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
        <style jsx>{`
          .video-grid {
            align-items: center;
            display: flex;
            height: 100%;
            justify-content: center;
            position: relative;
            width: 100%;
          }
          .video-grid .tiles {
            align-items: center;
            display: flex;
            flex-flow: row wrap;
            max-height: 100%;
            justify-content: center;
            margin: auto;
            overflow: hidden;
            width: 100%;
          }
          .video-grid .invite-others {
            width: calc(100% - 1.5rem);
            text-align: center;
          }
          .video-grid .invite-others .link {
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .video-grid .invite-others .link .url {
            flex-grow: 0.5;
          }
        `}</style>
      </div>
    );
  },
  () => true,
);

export default VideoGrid;
