const refreshError = {
  statusCode: 400,
  message: 'Refresh token is invalid',
};

const refreshSuccess = {
  statusCode: 200,
  message: {
    uz: 'Amaliyot muvaffaqiyatli bajarildi',
    en: 'Operation successfully completed',
    ru: 'Операция успешно выполнена',
  },
  data: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjYWY2Zjc2LTlhOTYtNDdlZC1hZmU0LTZlZGYzNWEyYjBjNyIsImlzQWN0aXZlIjp0cnVlLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3NjM4ODkzMzksImV4cCI6MTc2Mzg5MDIzOX0.n-mcTTU1nN41xS1uxZZCtH15Iq5_hGQlSnye6d-uORY',
    paylod: {
      id: '1caf6f76-9a96-47ed-afe4-6edf35a2b0c7',
      isActive: true,
      role: 'SUPER_ADMIN',
    },
  },
};

export const refreshAdminDoc = {
  success: refreshSuccess,
  error: refreshError,
};
