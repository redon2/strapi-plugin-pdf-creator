import React from 'react';
import { Box, Typography } from '@strapi/design-system';
import { useTr } from '../hooks/useTr';
import { SettingsType } from '../types';

interface SettingsTabProps {
    settings: SettingsType | null;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ settings }) => {
    const translate = useTr();
    return (
        <Box padding={4}>
            <Typography>{translate("settings.message")}</Typography>
            <Box marginTop={3}>
                {settings ? (
                    <>
                        <Box marginBottom={2}>
                            <Typography variant="beta">Folder ID: </Typography>
                            <Typography variant="gamma">{settings.folder_id}</Typography>
                        </Box>
                        <Box marginBottom={2}>
                            <Typography variant="beta">Permissions: </Typography>
                            <Typography variant="gamma">{settings.permissions}</Typography>
                        </Box>
                    </>
                ) : (
                    <Typography variant="gamma">No settings available.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default SettingsTab;
