import React, { useState, useEffect } from 'react';
import { Button, Typography, Flex } from "@strapi/design-system";
import { useFetchClient, useAuth } from '@strapi/strapi/admin';
import { Download } from '@strapi/icons';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PLUGIN_ID } from '../pluginId';
import { TemplateType } from 'src/types';

interface ResultTemplateType {
  results: TemplateType[];
}

const GenerateFileButton = () => {
  const { id } = useParams();
  const { token } = useAuth('App', (auth) => auth);
  const axiosInstance = axios.create({
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const location = useLocation();
  const client = useFetchClient();
  const [isVisible, setIsVisible] = useState(false);
  const [templates, setTemplates] = useState<TemplateType[]>([]);

  const getCollectionType = () => {
    const match = location.pathname.match(/collection-types\/(api::[^/]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const checkVisibility = async () => {
      try {
        const isCreate = location.pathname.includes('/create');
        if (isCreate) return setIsVisible(false);

        const { data } = await client.get<ResultTemplateType>(`/content-manager/collection-types/plugin::${PLUGIN_ID}.template`);
        if (data.results.length > 0) {
          data.results.forEach(item => {
            if (location.pathname.includes(item.collectionName)) {
              setIsVisible(true);
              setTemplates(prevTemplates => [...prevTemplates, item]); 
            }
          });
        }
      } catch (error) {
        console.error('Error checking button visibility:', error);
      }
    };

    checkVisibility();
  }, [client]);

  const collectionType = getCollectionType();

  const handleSubmit = async (templateId: string) => {
    const payload = { documentId: id, collectionType, templateId };

    try {
      const response = await axiosInstance.post(
        `/${PLUGIN_ID}/create-pdf`,
        { data: payload },
        { responseType: 'blob' }
      );

      if (response.data instanceof Blob) {
        const blobUrl = window.URL.createObjectURL(response.data);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', `${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        console.error('Expected a blob response, but got:', response);
      }
    } catch (error) {
      console.error('There has been a problem with your axios operation:', error);
    }
  };

  const Buttons = () => {
    return templates.map((template) => (
      <Button
        key={template.id}
        onClick={() => handleSubmit(template.documentId)}
        variant="primary"
        endIcon={<Download />}
        disabled={!template.enabled}
      >
        {template.name}
      </Button>
    ));
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Flex
      tag="aside"
      aria-labelledby="additional-information"
      background="neutral0"
      borderColor="neutral150"
      paddingBottom={4}
      paddingLeft={4}
      paddingRight={4}
      paddingTop={4}
      gap={3}
      direction="column"
      width="100%"
      alignItems="flex-start"
    >
      <Typography tag="h2" variant="sigma" textTransform="uppercase" textColor="neutral600">
        Download PDFs
      </Typography>
      <Buttons />
    </Flex>
  );
};

export default GenerateFileButton;
