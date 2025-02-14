import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { UserPreferences } from '$Definitions/application.d';
import { Preferences } from '$Components/Preferences';

interface Props {
    isTrayWindow: boolean;
    userPreferences: UserPreferences;
    setUserPreferences: Function;
    triggerSetAsTrayWindow: Function;
    autoLaunch: Function;
    storePreferences: Function;
}

export const BasicSettings = ( props: Props ) => {
    const {
        isTrayWindow,
        userPreferences,
        setUserPreferences,
        triggerSetAsTrayWindow,
        autoLaunch
    } = props;
    const requiredItems = {
        autoUpdate: true,
        pinToMenuBar: true,
        launchOnStart: true,
        showDeveloperApps: true
    };
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography>
                    Choose some basic settings. You can always change these
                    later.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Preferences
                    isTrayWindow={isTrayWindow}
                    userPreferences={userPreferences}
                    requiredItems={requiredItems}
                    onChange={setUserPreferences}
                    onChangeLaunchOnStart={autoLaunch}
                    onChangePinToMenu={triggerSetAsTrayWindow}
                />
            </Grid>
        </Grid>
    );
};
