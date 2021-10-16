const emailId = (inEmailId: string): boolean =>
  !!(inEmailId?.length > 0 && new RegExp('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$').test(inEmailId));

const password = (inPassword: string): boolean => (inPassword?.length ?? 0) > 0;

const validators = { emailId, password };

export default validators;
