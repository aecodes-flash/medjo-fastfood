import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

// This hook checks if user is logged in
// If not → shows the modal
export const useRequireAuth = () => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  // pendingAction stores what the user was trying to do
  const [pendingAction, setPendingAction] = useState(null);

  const requireAuth = (action) => {
    if (user) {
      // Already logged in → just do the action
      action();
    } else {
      // Not logged in → save the action and show modal
      setPendingAction(() => action);
      setShowModal(true);
    }
  };

  // Called after successful login → runs the pending action
  const onAuthSuccess = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return {
    requireAuth,
    showModal,
    setShowModal,
    onAuthSuccess,
  };
};