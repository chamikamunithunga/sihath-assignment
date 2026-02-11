export const notificationService = {
    // Check if browser supports notifications
    isSupported: () => 'Notification' in window && 'serviceWorker' in navigator,

    // Request permission
    requestPermission: async () => {
        if (!('Notification' in window)) return 'unsupported';

        // Check if already granted
        if (Notification.permission === 'granted') return 'granted';

        // Request
        const permission = await Notification.requestPermission();
        return permission; // 'granted', 'denied', or 'default'
    },

    // Subscribe to push (Simulation for now, as we need VAPID keys from backend)
    subscribeUser: async () => {
        if (!('serviceWorker' in navigator)) return null;

        try {
            const registration = await navigator.serviceWorker.ready;

            // In a real app, we would fetch VAPID public key from API here
            // const response = await fetch('/api/push-public-key');
            // const { publicKey } = await response.json();

            // const subscription = await registration.pushManager.subscribe({
            //   userVisibleOnly: true,
            //   applicationServerKey: urlBase64ToUint8Array(publicKey)
            // });

            // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(subscription) });

            // For now, we return a mock success
            console.log('User subscribed to notifications (Simulated)');
            return { msg: 'Subscribed' };

        } catch (error) {
            console.error('Failed to subscribe:', error);
            throw error;
        }
    },

    // Test local notification
    testNotification: async () => {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification('Test Notification', {
            body: 'This is a test notification from Urban Harvest Hub!',
            icon: '/icons/icon-192x192.png'
        });
    }
};
