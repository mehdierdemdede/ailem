const required = ['NEXT_PUBLIC_API_BASE_URL'] as const;

type EnvKey = (typeof required)[number];

const readEnv = (): Record<EnvKey, string> => {
  const result: Partial<Record<EnvKey, string>> = {};
  required.forEach((key) => {
    const value = process.env[key];
    if (!value) {
      if (key === 'NEXT_PUBLIC_API_BASE_URL') {
        result[key] = 'http://127.0.0.1:3000';
        return;
      }
      throw new Error(`Missing environment variable: ${key}`);
    }
    result[key] = value;
  });
  return result as Record<EnvKey, string>;
};

export const env = readEnv();
