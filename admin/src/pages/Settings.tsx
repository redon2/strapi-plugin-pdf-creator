import { useNotification } from '@strapi/strapi/admin';
import { Layouts, Page } from "@strapi/admin/strapi-admin";
import { Button, Tabs, Loader } from "@strapi/design-system";
import { useState, useCallback, useEffect } from "react";
import { useFetchClient } from '@strapi/strapi/admin';
import { useTr } from '../hooks/useTr';
import { PLUGIN_ID } from '../pluginId';
import TemplateTab from "./TemplateTab";
import SettingsTab from './SettingsTab';
import handleAPIError, { ToBeFixed } from '../utils/handleApiError';
import { SettingsType } from 'src/types';

const SettingsPage = () => {
  const client = useFetchClient();
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [activeTab, setActiveTab] = useState<string>("pdfTemplates");
  const [loading, setLoading] = useState<boolean>(true);

  const translate = useTr();
  const { toggleNotification } = useNotification();

  const fetchSettings = useCallback(async () => {
    setLoading(true); 
    try {
      const response = await client.get(`${PLUGIN_ID}/settings`);
      setSettings(response.data);
      const r = await client.get(`${PLUGIN_ID}/content-type`);
    } catch (error: ToBeFixed) {
      handleAPIError(error, toggleNotification, translate("error.loadingSettings"));
    } finally {
      setLoading(false);
    }
  }, [client, toggleNotification, translate]);

  useEffect(() => {
    fetchSettings().catch(() => {
      toggleNotification({
        type: "danger",
        title: translate("error"),
        message: 'Error loading settings.',
      });
    });
  }, []);

  return (
    <Layouts.Root>
      <Page.Title>{translate("home.title")}</Page.Title>
      <Layouts.Header
        id="header"
        title={translate("home.title")}
        subtitle={translate("home.subtitle")}
        primaryAction={
          <Button onClick={() => toggleNotification({ type: 'success', message: 'Home clicked!' })}>
            {translate("home.button")}
          </Button>
        }
      />
      <Layouts.Content>
        {loading ? ( 
          <Loader />
        ) : (
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <Tabs.List aria-label="Switch between tabs">
              <Tabs.Trigger value="pdfTemplates">
                {translate("tab.title.main")}
              </Tabs.Trigger>
              <Tabs.Trigger value="secondTab">
                {translate("tab.title.settings")}
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content
              value="pdfTemplates"
              style={{ borderBottomRightRadius: "6px", borderBottomLeftRadius: "6px" }}
            >
              <TemplateTab />
            </Tabs.Content>
            <Tabs.Content
              value="secondTab"
              style={{ borderBottomRightRadius: "6px", borderBottomLeftRadius: "6px" }}
            >
              <SettingsTab settings={settings} />
            </Tabs.Content>
          </Tabs.Root>
        )}
      </Layouts.Content>
    </Layouts.Root>
  );
};

export { SettingsPage };
