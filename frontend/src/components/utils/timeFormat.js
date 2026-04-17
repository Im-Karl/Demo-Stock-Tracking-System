export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);  

  if (diff < 60) return "Vừa xong";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;

  const weeks = Math.floor(days / 7);
  if (days < 30) return `${weeks} tuần trước`;

  const months = Math.floor(days / 30);
  if (days < 365) return `${months} tháng trước`;

  const years = Math.floor(days / 365);
  return `${years} năm trước`;
};

export const formatSmartTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return formatTimeAgo(dateString);

  return date.toLocaleDateString("vi-VN");
};