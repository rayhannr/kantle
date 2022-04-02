import { Alert } from "./Alert";
import { useAlert } from "../../context/AlertContext";
import { useDelayUnmount } from "../../lib/animation";

export const AlertContainer = () => {
  const { message, status, isVisible } = useAlert();
  const shouldRenderAlert = useDelayUnmount(isVisible, 100);

  return shouldRenderAlert ? <Alert isOpen={isVisible} message={message || ""} variant={status} /> : null;
};
