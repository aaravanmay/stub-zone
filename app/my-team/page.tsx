'use client';

import { useTeam } from '@/hooks/useTeam';
import TeamBuilder from '@/components/TeamBuilder';
import UpgradeAdvisor from '@/components/UpgradeAdvisor';

export default function MyTeamPage() {
  const { team, setPlayer, removePlayer, resetTeam, getTeamOVR } = useTeam();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">My Team</h1>
      <TeamBuilder team={team} setPlayer={setPlayer} removePlayer={removePlayer} resetTeam={resetTeam} teamOVR={getTeamOVR()} />
      <div className="mt-10">
        <UpgradeAdvisor team={team} />
      </div>
    </div>
  );
}
