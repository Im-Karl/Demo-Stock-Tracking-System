import { useQuery } from '@tanstack/react-query';
import { newsService } from '../services/newsService';

export const useNewsVN = (limit) => {
  return useQuery({
    queryKey: ['newsVN', limit],
    queryFn: async () => {
      const { data } = await newsService.searchVN(limit);
      return data;
    }
  });
};