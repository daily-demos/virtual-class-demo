import React, { useCallback, useEffect, useState } from 'react';
import { CardBody } from '../Card';
import Modal from '../Modal';
import { TrayButton } from '../Tray';
import Well from '../Well';
import { useCallState } from '../../contexts/CallProvider';
import { useUIState } from '../../contexts/UIStateProvider';
import { ReactComponent as PeopleIcon } from '../../icons/people-md.svg';
import Image from 'next/image';

export const BACKGROUND_EFFECTS_MODAL = 'effects';

export const BackgroundEffectsModal = () => {
  const [effect, setEffect] = useState('none');
  const { currentModals, closeModal } = useUIState();
  const { callObject, supportsVideoProcessing } = useCallState();

  const backgroundImages = [
    'vb-coffeeshop',
    'vb-forest',
    'vb-hills',
    'vb-library',
    'vb-lounge',
    'vb-ocean',
    'vb-office',
    'vb-palms',
    'vb-rollercoaster',
  ];

  const handleUpdateInputSettings = async (settings) => {
    const inputSettings = {};
    if (settings.model.endsWith('-blur')) {
      switch (settings.type) {
        case 'none':
          inputSettings.type = 'none';
          break;
        case 'soft-blur':
          inputSettings.type = 'background-blur';
          inputSettings.config = { strength: 0.5 };
          break;
        case 'strong-blur':
          inputSettings.type = 'background-blur';
          inputSettings.config = { strength: 1 };
          break;
      }
    } else {
      const { hostname, port, protocol } = window.location;
      inputSettings.type = 'background-image';
      inputSettings.config = { source: `${protocol}//${hostname}:${port}/assets/backgrounds/${settings.image}.jpg`}
    }
    // storing the bg effect
    localStorage.setItem('bg-effect', JSON.stringify(inputSettings));

    await callObject.updateInputSettings({ video: { processor: inputSettings }});
  }

  const getVariant = (label) => {
    if (effect === label) return 'outline-dark';
    return 'outline-gray';
  };

  const handleInputSettingsUpdated = useCallback(({ inputSettings }) => {
    switch (inputSettings.video.processor.type) {
      case 'none':
        setEffect('none');
        break;
      case 'background-blur':
        if (inputSettings.video.processor.config.strength < 1)
          setEffect('soft-blur');
        else setEffect('strong-blur');
        break;
      case 'background-image':
        const url = inputSettings.video.processor.config.source;
        setEffect(url.split('/').pop().split('.')[0]);
        break;
    }
  }, []);

  useEffect(() => {
    if (!callObject) return;

    callObject.on('input-settings-updated', handleInputSettingsUpdated);
    return () => callObject.off('input-settings-updated', handleInputSettingsUpdated);
  }, [callObject, handleInputSettingsUpdated]);

  return (
    <Modal
      title="Background Effects"
      isOpen={currentModals[BACKGROUND_EFFECTS_MODAL]}
      onClose={() => closeModal(BACKGROUND_EFFECTS_MODAL)}
    >
      <CardBody>
        {!supportsVideoProcessing ? (
          <Well variant="error">
            Background effects are not enabled for this room (or your browser does not
            support it.) Please enable video processing UI when creating the room or via
            the Daily dashboard.
          </Well>
        ) : <p>Experimental: Background effects may cause your fan to run louder and your battery to be depleted more
          quickly.</p>
        }
        {supportsVideoProcessing && (
          <div className="effects">
            <TrayButton
              label="None"
              effects
              variant={getVariant('none')}
              size="extra-large-square"
              onClick={() => handleUpdateInputSettings({ model: 'background-blur', type: 'none' })}
            >
              <PeopleIcon />
            </TrayButton>
            <TrayButton
              label="Soft blur"
              effects
              variant={getVariant('soft-blur')}
              size="extra-large-square"
              onClick={() => handleUpdateInputSettings({ model: 'background-blur', type: 'soft-blur' })}
            >
              <PeopleIcon className="soft-blur" />
            </TrayButton>
            <TrayButton
              label="Strong blur"
              effects
              variant={getVariant('strong-blur')}
              size="extra-large-square"
              onClick={() => handleUpdateInputSettings({ model: 'background-blur', type: 'strong-blur' })}
            >
              <PeopleIcon className="strong-blur" />
            </TrayButton>
            {backgroundImages.map((image, index) => (
              <TrayButton
                key={index}
                effects
                label={image.split('-').pop()}
                variant={getVariant(image)}
                size="extra-large-square"
                onClick={() => handleUpdateInputSettings({ model: 'background-image', image })}
              >
                <Image src={`/assets/backgrounds/${image}.jpg`} alt={image} layout="fill" className="background-image" />
              </TrayButton>
            ))}
          </div>
        )}
      </CardBody>
      <style jsx>{`
        .effects {
          display: flex;
          flex-wrap: wrap;
        }
        .effects :global(.button) {
          margin: 0.4rem;
        }
        .effects :global(.background-image) {
          border-radius: var(--radius-sm);
        }
        .effects :global(.soft-blur) {
          filter: blur(0.7px);
        }
        .effects :global(.strong-blur) {
          filter: blur(1px);
        }
      `}</style>
    </Modal>
  );
};

export default BackgroundEffectsModal;
