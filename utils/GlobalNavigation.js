import { createNavigationContainerRef } from '@react-navigation/native';

// Global navigation ref to navigate without passing props

export const navigationRef = createNavigationContainerRef()
export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}
export function goBack() {
    if (navigationRef.canGoBack()) {
        return navigationRef.goBack()
    }
}