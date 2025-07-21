'use client';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { IoArrowBack } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import { PiSelectionAllDuotone } from 'react-icons/pi';

import { useEnv } from '@/context/EnvContext';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/store/settingsStore';
import { useTrafficLightStore } from '@/store/trafficLightStore';
import WindowButtons from '@/components/WindowButtons';

export default function DownloadPage() {
  const router = useRouter();
  const { envConfig, appService } = useEnv();
  const { isTrafficLightVisible } = useTrafficLightStore();
  const { settings, setSettings, saveSettings } = useSettingsStore();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const headerRef = useRef<HTMLDivElement>(null);

  useTheme({ systemUIVisible: false });

  const handleGoBack = () => {
    // Keep login false to avoid infinite loop to redirect to the login page
    settings.keepLogin = false;
    setSettings(settings);
    saveSettings(envConfig, settings);
    router.back();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setSearchQuery(newQuery);
    };

  const handleDownload = () => {

  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={clsx(
        'bg-base-100 fixed inset-0 flex select-none flex-col items-center overflow-hidden overflow-y-auto',
        appService?.isIOSApp ? 'h-[100vh]' : 'h-dvh',
        appService?.isLinuxApp && 'window-border',
        appService?.hasRoundedWindow && 'rounded-window',
        appService?.hasSafeAreaInset && 'pt-[env(safe-area-inset-top)]',
      )}
    >
      <div
        ref={headerRef}
        className={clsx(
          'fixed z-10 flex w-full items-center justify-between py-2 pe-6 ps-4',
          appService?.hasTrafficLight && 'pt-11',
        )}
      >
        <button onClick={handleGoBack} className={clsx('btn btn-ghost h-8 min-h-8 w-8 p-0')}>
          <IoArrowBack className='text-base-content' />
        </button>

        {appService?.hasWindowBar && (
          <WindowButtons
            headerRef={headerRef}
            showMinimize={!isTrafficLightVisible}
            showMaximize={!isTrafficLightVisible}
            showClose={!isTrafficLightVisible}
            onClose={handleGoBack}
          />
        )}
      </div>
      <div
        className={clsx('z-20 pb-8', appService?.hasTrafficLight ? 'mt-24' : 'mt-12')}
        style={{ maxWidth: '420px' }}
      >
        <div className='relative flex h-9 w-full items-center sm:h-7'>
            <span className='absolute left-3 text-gray-500'>
                <FaSearch className='h-4 w-4' />
            </span>
            <input
                type='text'
                value={searchQuery}
                placeholder='Search Books...'
                onChange={handleSearchChange}
                spellCheck='false'
                className={clsx(
                'input rounded-badge bg-base-300/50 h-9 w-full pl-10 pr-10 sm:h-7',
                'font-sans text-sm font-light',
                'border-none focus:outline-none focus:ring-0',
                )}
            />
        </div>
        <div className='absolute center flex items-center space-x-2 text-gray-500 sm:space-x-4'>
            <span className='bg-base-content/50 mx-2 h-4 w-[0.5px]'></span>
            <button
                onClick={handleDownload}
                aria-label='Download'
                className='h-6'
                >
                <div
                    className='lg:tooltip lg:tooltip-bottom cursor-pointer'
                    data-tip='Download'
                >
                    <PiSelectionAllDuotone
                    role='button'
                    className={`h-6 w-6 fill-gray-400`}
                    />
                </div>
            </button>
        </div>
        <hr className='border-base-300 my-3 mt-6 w-64 border-t' />
      </div>
    </div>
  );
}
