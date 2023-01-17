export interface AppConfig {
  port: number;
}

export const appConfig = (): { app: AppConfig } => ({
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
});
