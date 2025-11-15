import { RewardsCard } from "../rewards-card";

export default function RewardsCardExample() {
  return (
    <div className="p-6">
      <RewardsCard
        points={1250}
        streak={7}
        achievements={["Budget Master", "Early Bird", "Event Goer"]}
      />
    </div>
  );
}
