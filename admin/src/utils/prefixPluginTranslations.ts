type TradOptions = { [key: string]: string };

export function prefixPluginTranslations(trad: TradOptions, pluginId: string): TradOptions {
    if (!pluginId) {
        throw new TypeError("pluginId can't be empty");
    }

    return Object.keys(trad).reduce((acc, current) => {
        acc[`${pluginId}.${current}`] = trad[current];
        return acc;
    }, {} as TradOptions);
}
