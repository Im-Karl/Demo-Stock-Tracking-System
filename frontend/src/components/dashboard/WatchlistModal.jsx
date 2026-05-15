import React, { useState, useEffect } from 'react';
import Modal from '../base-ui/Modal';
import TextField from '../base-ui/TextField';
import Switch from '../base-ui/Switch';
import Button from '../base-ui/Button';
import { RiNotification3Fill, RiPulseFill, RiAlarmWarningFill } from 'react-icons/ri';

export default function WatchlistModal({ isOpen, onClose, symbol, initialData, onSave }) {
  const [highThreshold, setHighThreshold] = useState('');
  const [lowThreshold, setLowThreshold] = useState('');
  const [alertEnabled, setAlertEnabled] = useState(true);

  useEffect(() => {
    if (initialData) {
      setHighThreshold(initialData.highThreshold || '');
      setLowThreshold(initialData.lowThreshold || '');
      setAlertEnabled(initialData.alertEnabled ?? true);
    } else {
      setHighThreshold('');
      setLowThreshold('');
      setAlertEnabled(true);
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    onSave({
      symbol,
      highThreshold: highThreshold ? Number(highThreshold) : null,
      lowThreshold: lowThreshold ? Number(lowThreshold) : null,
      alertEnabled,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Cấu hình theo dõi: ${symbol}`} maxWidth="max-w-md">
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-grey-500 dark:text-grey-400">
            Thiết lập ngưỡng giá để nhận thông báo qua Email khi mã <b>${symbol}</b> có biến động mạnh.
          </p>

          <TextField
            label="Ngưỡng giá CAO (VNĐ)"
            placeholder="Ví dụ: 55000"
            icon={RiAlarmWarningFill}
            type="number"
            value={highThreshold}
            onChange={(e) => setHighThreshold(e.target.value)}
          />

          <TextField
            label="Ngưỡng giá THẤP (VNĐ)"
            placeholder="Ví dụ: 45000"
            icon={RiPulseFill}
            type="number"
            value={lowThreshold}
            onChange={(e) => setLowThreshold(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-grey-50 dark:bg-grey-800/50 rounded-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${alertEnabled ? 'bg-primary-100 text-primary-600' : 'bg-grey-200 text-grey-500'}`}>
              <RiNotification3Fill size={20} />
            </div>
            <div>
              <div className="font-bold text-sm">Nhận thông báo qua Email</div>
              <div className="text-xs text-grey-500">Tắt nếu bạn không muốn bị làm phiền</div>
            </div>
          </div>
          <Switch checked={alertEnabled} onCheckedChange={setAlertEnabled} />
        </div>

        <div className="flex gap-3 pt-2">
          {initialData && (
            <Button intent="ghost" className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-500/10" onClick={() => onRemove(symbol)}>
              Bỏ theo dõi
            </Button>
          )}
          <div className="flex-1" />
          <Button intent="neutral" onClick={onClose}>
            Hủy
          </Button>
          <Button intent="primary" onClick={handleSave}>
            Lưu thiết lập
          </Button>
        </div>
      </div>
    </Modal>
  );
}
