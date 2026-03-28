'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface Props {
  allocations: { name: string; value: number; color: string }[];
}

export default function BudgetPieChart({ allocations }: Props) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-bg-surface border border-border-default rounded-lg p-2 shadow-xl">
        <div className="text-text-primary text-sm font-medium">{payload[0].name}</div>
        <div className="font-mono text-accent-primary">{payload[0].value.toLocaleString()} stubs</div>
      </div>
    );
  };

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5">
      <h3 className="font-heading font-semibold text-text-primary mb-2 text-center">Budget Allocation</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={allocations} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
            {allocations.map((a, i) => (
              <Cell key={i} fill={a.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => <span className="text-text-secondary text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
