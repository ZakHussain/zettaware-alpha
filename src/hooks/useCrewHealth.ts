import { useQuery } from '@tanstack/react-query';
import { CrewService } from '../api/services/crew.service';
import { useAppStore } from '../store/app.store';
import { CrewType } from '../config/endpoints.config';

const crewService = new CrewService();

export function useCrewHealth(crew?: CrewType) {
  const { updateCrewHealth } = useAppStore();

  const healthQuery = useQuery({
    queryKey: ['crew-health', crew],
    queryFn: async () => {
      if (crew) {
        const health = await crewService.checkCrewHealth(crew);
        updateCrewHealth(crew, health);
        return health;
      } else {
        const allHealth = await crewService.checkAllCrewsHealth();
        Object.entries(allHealth).forEach(([crewType, health]) => {
          updateCrewHealth(crewType as CrewType, health);
        });

        return allHealth;
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
    refetchOnWindowFocus: true,
    staleTime: 15000, // Consider stale after 15 seconds
  });

  return {
    health: healthQuery.data,
    isLoading: healthQuery.isLoading,
    error: healthQuery.error,
    refetch: healthQuery.refetch
  };
}