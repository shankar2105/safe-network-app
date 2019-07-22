import { TYPES } from '$App/actions/launchpad_actions';
import { TYPES as ALIAS_TYPES } from '$App/actions/alias/launchpad_actions';
import { LaunchpadState, UserPreferences } from '../definitions/application.d';
import { ERRORS, defaultPreferences } from '$Constants/index';

export const initialState: LaunchpadState = {
    shouldOnboard: false,
    userPreferences: { ...defaultPreferences.userPreferences },
    notifications: {}
};

export function launchpadReducer( state = initialState, action ): LaunchpadState {
    const { payload } = action;

    switch ( action.type ) {
        case TYPES.SET_USER_PREFERENCES: {
            const newUserPreferences: UserPreferences = {
                ...state.userPreferences,
                ...payload
            };
            if (
                Object.keys( newUserPreferences ).length !==
                Object.keys( initialState.userPreferences ).length
            ) {
                throw ERRORS.INVALID_PROP;
            }

            return { ...state, userPreferences: newUserPreferences };
        }

        case TYPES.PUSH_NOTIFICATION: {
            const newNotifications = { ...state.notifications };
            if ( !payload.notification || !payload.notification.id )
                throw ERRORS.NOTIFICATION_ID_NOT_FOUND;

            newNotifications[payload.notification.id] = {
                ...payload.notification
            };
            return { ...state, notifications: newNotifications };
        }

        case TYPES.DISMISS_NOTIFICATION: {
            const newNotifications = { ...state.notifications };
            if ( !payload.notificationId ) throw ERRORS.NOTIFICATION_ID_NOT_FOUND;

            delete newNotifications[payload.notificationId];
            return { ...state, notifications: newNotifications };
        }

        case TYPES.CHECK_SHOULD_ONBOARD: {
            if ( typeof payload.shouldOnboard !== 'boolean' )
                throw ERRORS.INVALID_TYPE;

            return {
                ...state,
                shouldOnboard: payload.shouldOnboard
            };
        }

        case TYPES.ONBOARD_COMPLETED: {
            return {
                ...state,
                shouldOnboard: false
            };
        }

        case ALIAS_TYPES.ALIAS_AUTO_LAUNCH:
        case ALIAS_TYPES.ALIAS_PIN_TO_TRAY:
        case ALIAS_TYPES.ALIAS_STORE_USER_PREFERENCES:
        default:
            return state;
    }
}
