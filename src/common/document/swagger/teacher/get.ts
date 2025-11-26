const successAll = {
  statusCode: 200,
  message: {
    uz: 'Amaliyot muvaffaqiyatli bajarildi',
    en: 'Operation successfully completed',
    ru: 'Операция успешно выполнена',
  },
  data: [
    {
      id: '5614ddef-a490-4b32-98bc-5e3537b895d0',
      isActive: true,
      isDeleted: false,
      createdAt: '2025-11-23T10:35:35.793Z',
      updatedAt: '2025-11-23T11:18:25.719Z',
      name: 'John Doe',
      username: 'john123',
      password: '$2b$07$Ee/I0wnheKPITqMkrYyxq.kQ58ezB9PXhe51TrhBPnVfWjAkytQry',
      role: 'TEACHER',
      specification: 'fullstack',
    },
  ],
};

const errorAll = {
  statusCode: 404,
  error: {
    message: 'Authorization error',
  },
};

const successOne = {
  statusCode: 200,
  message: {
    uz: 'Amaliyot muvaffaqiyatli bajarildi',
    en: 'Operation successfully completed',
    ru: 'Операция успешно выполнена',
  },
  data: {
    id: '5614ddef-a490-4b32-98bc-5e3537b895d0',
    isActive: true,
    isDeleted: false,
    createdAt: '2025-11-23T10:35:35.793Z',
    updatedAt: '2025-11-23T11:18:25.719Z',
    name: 'John Doe',
    username: 'john123',
    password: '$2b$07$Ee/I0wnheKPITqMkrYyxq.kQ58ezB9PXhe51TrhBPnVfWjAkytQry',
    role: 'TEACHER',
    specification: 'fullstack',
  },
};

const errorOne = {
  statusCode: 404,
  error: {
    message: 'Teacher not found',
  },
};

export const getTeacherDoc = {
  successAll,
  errorAll,
  successOne,
  errorOne,
};
