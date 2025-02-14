import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core';
import { MeatballMenu } from '$Components/MeatballMenu';
import { logger } from '$Logger';

import styles from './ApplicationOverview.css';
import { App } from '$Definitions/application.d';

interface Props {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    application: App;
}

export class ApplicationOverview extends Component<Props> {
    handleDownload = () => {
        const { application, installApp } = this.props;
        logger.silly( 'ApplicationOverview: clicked download ', application );
        installApp( application );
    };

    handleOpen = () => {
        const { application, openApp } = this.props;
        logger.silly( 'ApplicationOverview: clicked open', application );
        openApp( application );
    };

    handleUninstall = () => {
        const { application, uninstallApp } = this.props;
        logger.silly( 'ApplicationOverview: clicked uninstall', application );
        uninstallApp( application );
    };

    render() {
        const { application } = this.props;

        return (
            <React.Fragment>
                {/* progress ? (
                        <div>{`Progress! ${progress}`}</div>
                    ) : (
                        // progress < 1 ? (
                        // ) : (
                        //     <Button onClick={handleOpen}>
                        //         Open it (doesnt go yet)
                        //     </Button>
                        // )
                        <Button
                            className="download"
                            variant="contained"
                            onClick={handleDownload}
                        >
                            {`Download ${name}`}
                        </Button>
                    ) */}

                <Grid container alignItems="center">
                    <Grid item xs={7} className={styles.name}>
                        <Link to={`/application/${application.id}`}>
                            {application.name}
                        </Link>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            className="install"
                            onClick={this.handleDownload}
                            size="small"
                            color="primary"
                            variant="contained"
                        >
                            Install
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <MeatballMenu {...this.props} />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
