import { PLUGIN_ID } from "../pluginId";

const getUrl = (path = "") => `/plugins/${PLUGIN_ID}/${path}`;

export default getUrl;