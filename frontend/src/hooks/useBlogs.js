import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../services/blogService';

// 1. Hook lấy danh sách
export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await blogService.getAll();
      return data;
    },
  });
};

// 2. Hook lấy chi tiết 1 bài (MỚI)
export const useBlogBySlug = (slug) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await blogService.getOne(slug);
      return data;
    },
    enabled: !!slug, // Chỉ chạy khi có slug
  });
};

// 3. Hook tạo bài
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
    },
  });
};

// 4. Hook đổi trạng thái Public/Private (MỚI)
export const useTogglePublic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug }) => blogService.togglePublic(slug),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['blog', variables.slug]);
      queryClient.invalidateQueries(['blogs']);
    },
  });
};
