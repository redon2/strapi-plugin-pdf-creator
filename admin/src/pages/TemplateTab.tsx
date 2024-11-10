import React, { useEffect, useState, useCallback } from 'react';
import { useNotification } from "@strapi/strapi/admin";
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system';
import { Typography } from '@strapi/design-system';
import { Checkbox } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { useTr } from '../hooks/useTr';
import { TemplateType } from "../types";
import { PLUGIN_ID } from '../pluginId';


import handleAPIError, { ToBeFixed } from '../utils/handleApiError';

const TemplateTab: React.FC = () => {
    const translate = useTr();
    const [templates, setTemplates] = useState<TemplateType[]>([]);
    const { toggleNotification } = useNotification();
    const client = useFetchClient();

    const init = useCallback(async () => {
        try {
            // const response = await client.get<FileResponse>(`/upload/files?sort=createdAt:DESC&filters[$and][0][mime][$not][$contains][[0]]=image&filters[$and][0][mime][$not][$contains][[1]]=video`);
            const response = await client.get(`content-manager/collection-types/plugin::${PLUGIN_ID}.template`);
            const data = response.data;
            setTemplates(data.results);
        } catch (error: ToBeFixed) {
            console.log('Error:', error);
            handleAPIError(error);
            toggleNotification({
                type: "danger",
                title: translate("error"),
                message: error.message || 'Error loading files',
            });
        }
    }, [client, toggleNotification, translate]);

    useEffect(() => {
        init().catch(() => {
            console.log('Error while fetching data');
            toggleNotification({
                type: "danger",
                title: translate("error"),
                message: 'Error loading data',
            });
        });
    }, []);

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>
                        <Typography variant="sigma">ID</Typography>
                    </Th>
                    <Th>
                        <Typography variant="sigma">Template Name</Typography>
                    </Th>
                    <Th>
                        <Typography variant="sigma">Collection Name</Typography>
                    </Th>
                    <Th>
                        <Typography variant="sigma">Actions</Typography>
                    </Th>

                </Tr>
            </Thead>
            <Tbody>
                {Array.isArray(templates) && templates.length > 0 ? (
                    templates.map(template => (
                        <Tr key={template.id}>
                            <Td><Typography>{template.id}</Typography></Td>
                            <Td><Typography>{template.name}</Typography></Td>
                            <Td><Typography>{template?.collectionName}</Typography></Td>
                            <Td><Typography>coming soon.</Typography></Td>
                        </Tr>
                    ))
                ) : (
                    <Tr>
                        <Td colSpan={4}><Typography>No Templates found.</Typography></Td>
                    </Tr>
                )}
            </Tbody>
        </Table>
    );
};

export default TemplateTab;
