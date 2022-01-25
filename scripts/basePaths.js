const getDefaultBasePathScript = (basePath) => {
    return {
        scripts: {
            'env-var': `cross-env BASE_PATH=${basePath}`
        }
    };
};

module.exports = {
    getDefaultBasePathScript
};