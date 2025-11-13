export const generateUserName = () => {
  const userName = 'user-' + Math.random().toString(30).slice(2);

  return userName;
};
