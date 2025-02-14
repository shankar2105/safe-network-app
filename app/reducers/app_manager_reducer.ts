import { TYPES } from '$Actions/app_manager_actions';
import { TYPES as ALIAS_TYPES } from '$App/actions/alias/app_manager_actions';
import { TYPES as APP_TYPES } from '$App/actions/application_actions';

import {
    AppManagerState,
    ManagedApplication
} from '../definitions/application.d';
import { ERRORS } from '$Constants/errors';

export const initialState: AppManagerState = {
    applicationList: {}
};

const setApplicationList = ( state, applicationList ) => {
    const newApplicationList = {};

    Object.values( applicationList ).forEach( ( app: ManagedApplication ) => {
        if ( !app.id ) throw new Error( ERRORS.APP_ID_NOT_FOUND );
        newApplicationList[app.id] = { ...app };
    } );
    return {
        ...state,
        applicationList: newApplicationList
    };
};

const updateAppInApplicationList = ( state, targetApp ) => {
    const updatedState = {
        ...state,
        applicationList: { ...state.applicationList }
    };

    updatedState.applicationList[targetApp.id] = targetApp;
    return updatedState;
};

export function appManager( state = initialState, action ): AppManagerState {
    const { payload } = action;

    let targetApp;
    if ( payload && payload.appId ) {
        targetApp = { ...state.applicationList[payload.appId] };
    }

    switch ( action.type ) {
        case `${TYPES.SET_APPS}`: {
            return setApplicationList( state, payload );
        }

        case TYPES.RESET_APP_STATE: {
            if ( !targetApp ) return state;
            targetApp.isInstalling = false;
            targetApp.isUninstalling = false;
            targetApp.isUpdating = false;
            targetApp.progress = null;
            targetApp.error = null;
            return updateAppInApplicationList( state, targetApp );
        }

        case TYPES.CANCEL_APP_INSTALLATION: {
            if ( !targetApp || !targetApp.isInstalling ) return state;
            targetApp.isInstalling = false;
            targetApp.progress = 0;
            return updateAppInApplicationList( state, targetApp );
        }

        case TYPES.PAUSE_APP_INSTALLATION: {
            if ( !targetApp || !targetApp.isInstalling ) return state;
            targetApp.isInstalling = false;
            return updateAppInApplicationList( state, targetApp );
        }

        case TYPES.RETRY_APP_INSTALLATION: {
            if ( !targetApp || targetApp.isInstalling ) return state;
            targetApp.isInstalling = true;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_INSTALL_APP}_PENDING`: {
            if ( !targetApp ) return state;
            targetApp.isInstalling = true;
            targetApp.progress = payload.progress || 0;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_INSTALL_APP}_SUCCESS`: {
            if ( !targetApp || !targetApp.isInstalling ) return state;
            targetApp.isInstalling = false;
            targetApp.progress = 100;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_INSTALL_APP}_FAILURE`: {
            if ( !targetApp || !targetApp.isInstalling ) return state;
            targetApp.isInstalling = false;
            targetApp.progress = 0;
            targetApp.error = payload.error;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_UNINSTALL_APP}_PENDING`: {
            if ( !targetApp ) return state;
            targetApp.isUninstalling = true;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_UNINSTALL_APP}_SUCCESS`: {
            if ( !targetApp ) return state;
            targetApp.isUninstalling = false;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_CHECK_APP_HAS_UPDATE}`: {
            if ( !targetApp ) return state;
            targetApp.hasUpdate = payload.hasUpdate;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_UPDATE_APP}_PENDING`: {
            if ( !targetApp ) return state;
            targetApp.isUpdating = true;
            targetApp.progress = payload.progress || 0;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_UPDATE_APP}_SUCCESS`: {
            if ( !targetApp ) return state;
            targetApp.isUpdating = false;
            targetApp.hasUpdate = false;
            targetApp.progress = 100;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_UPDATE_APP}_FAILURE`: {
            if ( !targetApp ) return state;
            targetApp.isUpdating = false;
            targetApp.progress = 0;
            targetApp.error = payload.error;
            return updateAppInApplicationList( state, targetApp );
        }

        case `${ALIAS_TYPES.ALIAS_SKIP_APP_UPDATE}_PENDING`: {
            if ( !targetApp ) return state;
            if ( !payload.version ) throw new Error( ERRORS.VERSION_NOT_FOUND );
            targetApp.hasUpdate = false;
            targetApp.lastSkippedVersion = payload.version;
            return updateAppInApplicationList( state, targetApp );
        }

        case APP_TYPES.SET_NEXT_RELEASE_DESCRIPTION: {
            if ( !targetApp ) return state;

            targetApp.updateDescription = payload.updateDescription;

            return updateAppInApplicationList( state, targetApp );
        }

        default:
            return state;
    }
}
