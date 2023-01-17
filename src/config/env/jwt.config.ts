export interface JWTConfig {
  secret: string;
}

export const jwtConfig = (): { jwt: JWTConfig } => {
  const { JWT_SECRET } = process.env;

  return {
    jwt: {
      secret: JWT_SECRET,
    },
  };
};
