/**
 * PWA Install Prompt Component
 * Provides native app installation experience with enhanced mobile optimization
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { X, Smartphone, Download, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show install prompt after a delay (better UX)
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('📱 PWA was installed');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle install button click
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User accepted the PWA install prompt');
      setShowInstallPrompt(false);
    } else {
      console.log('❌ User dismissed the PWA install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
  };

  // Handle dismiss
  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if user previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  // Handle app update
  const handleUpdate = async () => {
    setIsUpdating(true);
    
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          // Tell the waiting SW to skip waiting and become active
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Wait for the new SW to take control
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            // Reload the page to get the new content
            window.location.reload();
          });
        } else {
          // Manually check for updates
          if (registration) {
            await registration.update();
          }
          setIsUpdating(false);
        }
      } catch (error) {
        console.error('❌ Error updating PWA:', error);
        setIsUpdating(false);
      }
    }
  };

  // Don't show anything if the app is already installed
  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {/* Connection Status */}
        <Card className={`p-3 mb-2 ${isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">Offline Mode</span>
              </>
            )}
          </div>
        </Card>

        {/* Update Available */}
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Madrasti App</span>
              <Badge variant="secondary" className="text-xs">
                Installed
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center space-x-1"
            >
              {isUpdating ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              <span className="text-xs">Update</span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Don't show install prompt if not available or user dismissed recently
  if (!showInstallPrompt || !deferredPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className={`p-3 ${isOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">Offline Mode</span>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50">
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Install Madrasti</h4>
              <p className="text-sm text-blue-700">Get the full app experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            <div className="flex items-center space-x-1">
              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
              <span>Works offline</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
              <span>Fast loading</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
              <span>Push notifications</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
              <span>Native feel</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleInstallClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            size="sm"
            className="text-blue-600 border-blue-300"
          >
            Later
          </Button>
        </div>

        <div className="mt-2 text-xs text-blue-600 text-center">
          Free • No app store needed • Instant access
        </div>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;