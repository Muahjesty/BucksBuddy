import QuickAction from '../QuickAction';
import { Plus, Send, Scan, History } from 'lucide-react';

export default function QuickActionExample() {
  return (
    <div className="flex gap-3 overflow-x-auto p-4">
      <QuickAction icon={Plus} label="Add Funds" />
      <QuickAction icon={Send} label="Transfer" />
      <QuickAction icon={Scan} label="Scan QR" />
      <QuickAction icon={History} label="History" />
    </div>
  );
}
