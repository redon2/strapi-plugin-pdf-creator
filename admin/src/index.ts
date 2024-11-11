import { prefixPluginTranslations } from './utils/prefixPluginTranslations';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import GenerateFileButton from './components/GenerateFileButton';
import { PERMISSIONS } from './constants';

export default {
  register(app: any) {
    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: { id: `${PLUGIN_ID}.SettingsNav.section-label`, defaultMessage: 'PDF Creator' },
      },
      [
        {
          intlLabel: {
            id: `${PLUGIN_ID}.SettingsNav.plugin.title`,
            defaultMessage: 'Settings',
          },
          id: 'settings',
          to: PLUGIN_ID,
          Component: () =>
            import('./pages/Settings').then((mod) => ({
              default: mod.ProtectedSettingsPage,
            })),
          permissions: PERMISSIONS.settings,
        },
      ]
    );

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },
  bootstrap(app: any) {
    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
      name: 'PDF Creator',
      Component: GenerateFileButton,
    });
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, PLUGIN_ID),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return importedTranslations;
  },
};
