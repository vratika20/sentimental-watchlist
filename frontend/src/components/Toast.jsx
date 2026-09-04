import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="toast-success">
      <CheckCircle size={18} />
      <span>{message}</span>
    </div>
  );
}
