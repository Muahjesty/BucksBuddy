import SpendingChart from '../SpendingChart';

export default function SpendingChartExample() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <SpendingChart type="weekly" />
      <SpendingChart type="category" />
    </div>
  );
}
