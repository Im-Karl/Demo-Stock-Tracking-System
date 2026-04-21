import FancyIcon from './FancyIcon';

export default function StatsCard({ stats }) {
  return (
    <div className="flex justify-between gap-6 pt-8">
      {stats.map(({ stat, label, Icon, className }) => (
        <div className="mr-auto flex gap-6 items-center">
          <FancyIcon Icon={Icon} className={className} />
          <div>
            <h4 className="text-3xl font-bold">{stat}</h4>
            <p className="opacity-75">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
