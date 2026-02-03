module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'clave_secreta_super_segura_para_desarrollo',
    JWT_EXPIRES_IN: '24h'
};
