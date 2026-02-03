const { getAllTiposActividad } = require('./src/models/tiposActividad.model');
const pool = require('./src/db/pool');

async function test() {
    try {
        console.log('Testing getAllTiposActividad...');
        const tipos = await getAllTiposActividad();
        console.log('✅ Success! Tipos retrieves:', tipos);
    } catch (error) {
        console.error('❌ Error in test:', error);
    } finally {
        await pool.end();
    }
}

test();
