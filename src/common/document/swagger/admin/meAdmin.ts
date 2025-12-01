const success = {
  statusCode: 200,
  message: {
    uz: 'Amaliyot muvaffaqiyatli bajarildi',
    en: 'Operation successfully completed',
    ru: 'Операция успешно выполнена',
  },
  data: {
    id: '1caf6f76-9a96-47ed-afe4-6edf35a2b0c7',
    createdAt: '2025-11-22T08:14:13.229Z',
    updatedAt: '2025-11-22T08:14:13.229Z',
    username: 'Admin1',
    fullName: 'Dinmuhammad',
    role: 'SUPER_ADMIN',
  },
};
const error = {
  statusCode: 401,
  message: 'Unauthorized',
};

export const meAdminDoc = {
  success,
  error,
};
