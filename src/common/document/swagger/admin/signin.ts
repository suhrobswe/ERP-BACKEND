const adminSigninSuccess = {
  statusCode: 200,
  message: {
    uz: 'Amaliyot muvaffaqiyatli bajarildi',
    en: 'Operation successfully completed',
    ru: 'Операция успешно выполнена',
  },
  data: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjYWY2Zjc2LTlhOTYtNDdlZC1hZmU0LTZlZGYzNWEyYjBjNyIsImlzQWN0aXZlIjp0cnVlLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3NjM4MTAyMDUsImV4cCI6MTc2MzgxMTEwNX0.jX1NxIV9FAnSpjndE2nAgsSrJBHFHx73_NjVW3AZyzo',
    user: {
      id: '1caf6f76-9a96-47ed-afe4-6edf35a2b0c7',
      username: 'Admin1',
      fullName: 'Dinmuhammad',
      role: 'SUPER_ADMIN',
      createdAt: '2025-11-22T08:14:13.229Z',
      updatedAt: '2025-11-22T08:14:13.229Z',
    },
  },
};

const adminSigninError = {
  statusCode: 400,
  message: 'Username or password is incorrect',
};

export const signInDoc = {
  success: adminSigninSuccess,
  error: adminSigninError,
};
