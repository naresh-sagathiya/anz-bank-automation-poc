import 'dotenv/config';

export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://parabank.parasoft.com/parabank/index.htm',
  browser: process.env.BROWSER ?? 'chromium',
  headless: process.env.HEADED === 'true' ? false : process.env.HEADLESS !== 'false',
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT ?? 15000)
} as const;
