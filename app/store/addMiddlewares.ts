import thunk from 'redux-thunk';
import { inRendererProcess, inBgProcess } from '$Constants';
import promiseMiddleware from 'redux-promise';

import { forwardToRenderer, forwardToMain, triggerAlias } from 'electron-redux';

export const addMiddlewares = ( middlewares: Array<Function> ): void => {
    middlewares.push( thunk );

    if ( inBgProcess ) {
        middlewares.push( triggerAlias );
    }

    if ( inRendererProcess ) {
        // must be first
        middlewares.unshift( forwardToMain );
    }

    if ( !inRendererProcess ) {
        // must be last
        middlewares.push( forwardToRenderer );
    }

    middlewares.unshift( promiseMiddleware );
};
