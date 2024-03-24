const testEnv: Record<string, string | number> = {
    MONGO_URI: 'mongodb://localhost:27017/short-url-test',
    BASE_URL: 'https://short.est',
    SHORT_URL_LENGTH: 6,
    PORT: 4444,
};

export const configServiceMock = {
    get(key: string) {
        return testEnv[key];
    },
};
