import RewardCard from '../RewardCard';

export default function RewardCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-4xl">
      <RewardCard
        title="Budget Master"
        description="Stay under budget for 3 consecutive months"
        points={500}
        achieved={true}
        type="trophy"
      />
      <RewardCard
        title="Smart Spender"
        description="Use campus card for 20+ transactions"
        points={250}
        achieved={true}
        type="star"
      />
      <RewardCard
        title="Meal Planner"
        description="Track all meal swipes for one month"
        points={300}
        achieved={false}
        type="target"
      />
      <RewardCard
        title="Early Bird"
        description="Pay for 5 events before deadline"
        points={150}
        achieved={false}
        type="star"
      />
    </div>
  );
}
