const success = {
  statusCode: 201,
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
    updatedAt: '2025-11-23T10:35:35.793Z',
    name: 'John Doe',
    username: 'john123',
    password: '$2b$07$1LF2n1S2RgJxHX40KrfK9OO71FybO0jjO8UH44GFApFjtyeUIpoCO',
    role: 'TEACHER',
    specification: 'fullstack',
  },
};

const error = {
  statusCode: 409,
  error: {
    message: 'Username already exists',
  },
};
export const CreateTeacherDoc = {
  error,
  success,
};
