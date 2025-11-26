const successAll = {
  statusCode: 200,
  message: {
    uz: 'Amaliyot muvaffaqiyatli bajarildi',
    en: 'Operation successfully completed',
    ru: 'Операция успешно выполнена',
  },
  data: [
    {
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
    {
      id: '1caf6f76-9a96-47ed-afe4-6edf35a2b0c7',
      isActive: true,
      isDeleted: false,
      createdAt: '2025-11-22T08:14:13.229Z',
      updatedAt: '2025-11-22T08:14:13.229Z',
      username: 'Admin1',
      fullName: 'Dinmuhammad',
      password: '$2b$07$mopzgB.UCNFWBvdY75syIebTo8s9Ds9MInQliPyOqiOoYwDpfSCi.',
      is_active: true,
      role: 'SUPER_ADMIN',
    },
  ],
};

const errorAll = {
  statusCode: 401,
  message: 'Unauthorized',
};

const successOne = {
  statusCode: 200,
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

export const getAllAdminDoc = {
  success: successAll,
  error: errorAll,
};

export const getOneAdminDoc = {
  success: successOne,
  error: errorAll,
};
