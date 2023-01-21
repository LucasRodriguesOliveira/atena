export interface SwaggerConfig {
  appName: string;
  description: string;
  version: string;
  tags: string[];
  path: string;
}

export const swaggerConfig = (): { swagger: SwaggerConfig } => {
  const { APP_NAME, APP_DESCRIPTION, APP_VERSION, SWAGGER_TAGS, SWAGGER_PATH } =
    process.env;

  return {
    swagger: {
      appName: APP_NAME,
      description: APP_DESCRIPTION,
      version: APP_VERSION,
      tags: (SWAGGER_TAGS || '').split(','),
      path: SWAGGER_PATH || 'docs',
    },
  };
};
