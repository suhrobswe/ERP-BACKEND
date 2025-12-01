const createAdminSuccess = {
  statusCode: 201,
  message: {
    uz: 'Amaliyot muvaffaqiyatli bajarildi',
    en: 'Operation successfully completed',
    ru: 'Операция успешно выполнена',
  },
  data: {
    id: '7e0c4c0d-88c7-443f-8218-5cadac4c9ef7',
    isActive: true,
    isDeleted: false,
    createdAt: '2025-11-22T11:37:38.092Z',
    updatedAt: '2025-11-22T11:37:38.092Z',
    username: 'admin_user',
    fullName: 'John Doe',
    password: '$2b$07$S6zShDYgZdSCw2lNLrNG6.MbzENFKKNj8f.DRWT4hqkxrAa3LfIvq',
    is_active: true,
    role: 'ADMIN',
  },
};

const createAdminErrorUsername = {
  statusCode: 409,
  message: 'Username already exists',
};

const createAdminErrorPassword = {
  statusCode: 422,
  message: ['password is not strong enough'],
};

export const createAdminDoc = {
  success: createAdminSuccess,
  error: {
    username: createAdminErrorUsername,
    password: createAdminErrorPassword,
  },
};
