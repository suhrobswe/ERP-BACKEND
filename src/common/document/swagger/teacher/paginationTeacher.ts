const success = {
  statusCode: 200,
  message: {
    uz: 'Amaliyot muvaffaqiyatli bajarildi',
    ru: 'Операция успешно выполнена',
    en: 'Operation successfully completed',
  },
  data: [
    {
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
      groups: [],
    },
  ],
  totalElements: 1,
  totalPages: 1,
  pageSize: 10,
  currentPage: 1,
  from: 1,
  to: 1,
};

const error = {
  statusCode: 400,
  error: {
    message: 'Bad Request',
  },
};

export const PaginationTeacherDoc = {
  success,
  error,
};
