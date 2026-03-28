import { OrderStatus } from '../../types';
import { getStatusLabel, getStatusColor } from '../../utils/formatters';

interface BadgeProps {
  status: OrderStatus;
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
