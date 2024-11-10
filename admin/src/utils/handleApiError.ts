export type ToBeFixed = any;
import { PLUGIN_ID } from "../pluginId";

const handleAPIError = (
  err: Error | null = null,
  toggleNotification: ToBeFixed = null,
  message = "app.components.notification.error"
) => {
  toggleNotification({
    type: "warning",
    message: `${PLUGIN_ID}.${message}`,
  });

  if (err) {
    throw err;
  } else {
    throw new Error("error");
  }
};

export default handleAPIError;