const signOutSuccess = {
  statusCode: 200,
  message: {
    uz: 'Amaliyot muvaffaqiyatli bajarildi',
    en: 'Operation successfully completed',
    ru: 'Операция успешно выполнена',
  },
  data: {},
};

const signOutError = {
  statusCode: 400,
  message: 'Token expired or invalid',
};

export const signOutDoc = {
  success: signOutSuccess,
  error: signOutError,
};
