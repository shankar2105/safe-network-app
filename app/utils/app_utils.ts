import { remote } from 'electron';

export const generateRandomString = (): string => {
    return (
        Math.random()
            .toString( 36 )
            .substring( 2, 15 ) +
        Math.random()
            .toString( 36 )
            .substring( 2, 15 )
    );
};

export const databaseCallBackHandler = ( resolve, reject ) => {
    return ( success, data ) => {
        return success ? resolve( data ) : reject( data );
    };
};

export const camelToTitle = ( camelCase ) =>
    camelCase
        .replace( /([A-Z])/g, ( match ) => ` ${match}` )
        .replace( /^./, ( match ) => match.toUpperCase() )
        .trim();
