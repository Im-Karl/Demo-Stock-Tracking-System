import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { RiAlertFill, RiInformationFill, RiErrorWarningFill } from 'react-icons/ri';

/**
 * A standardized confirmation modal to replace window.confirm().
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  intent = 'danger',
  isLoading = false,
}) {
  const getIcon = () => {
    switch (intent) {
      case 'danger':
        return <RiErrorWarningFill className="text-red-500" size={32} />;
      case 'primary':
        return <RiInformationFill className="text-primary-500" size={32} />;
      case 'warning':
        return <RiAlertFill className="text-amber-500" size={32} />;
      default:
        return <RiInformationFill className="text-grey-500" size={32} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 pt-1">{getIcon()}</div>
          <div className="flex-1">
            <p className="text-grey-600 dark:text-grey-300 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8">
          <Button intent="ghost" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button intent={intent} onClick={onConfirm} loading={isLoading} className="min-w-[100px]">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
