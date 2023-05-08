export const TEST_ENV = 'test';
export const PROD_ENV = 'production';
export const DEV_ENV = 'development';

export const isTestEnvironment = () => {
  return process.env.NODE_ENV === TEST_ENV;
};

export const isProductionEnvironment = () => {
  return process.env.NODE_ENV === PROD_ENV;
};

export const isDevelopmentEnvironment = () => {
  return process.env.NODE_ENV === DEV_ENV;
};
