import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.DB_SERVER_IP,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1'
    },
    validateBulkLoadParameters: false,
    connectTimeout: 3000, 
    requestTimeout: 3000, 
    connectionTimeout: 3000, 
    pool: {
      max: 20,
      min: 5, 
      idleTimeoutMillis: 15000,
      acquireTimeoutMillis: 3000,
      createTimeoutMillis: 3000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      drainTimeoutMillis: 3000
    }
  }
};

// Crear un pool de conexiones global con manejo de errores
let pool;
let poolConnect;

const initializePool = async () => {
  try {
    pool = new sql.ConnectionPool(config);
    poolConnect = pool.connect();

    const warmupConnections = async () => {
      try {
        const promises = [];
        for (let i = 0; i < config.options.pool.min; i++) {
          promises.push(pool.connect());
        }
        await Promise.all(promises);
        console.log('Pool de conexiones precalentado exitosamente');
      } catch (error) {
        console.error('Error al precalentar el pool:', error);
      }
    };

    pool.on('error', err => {
      console.error('Error en el pool de conexiones:', err);
      setTimeout(initializePool, 3000);
    });

    await poolConnect;
    await warmupConnections();

    return pool;
  } catch (err) {
    console.error('Error al inicializar el pool:', err);
    throw err;
  }
};

// Inicializar el pool al cargar el módulo
initializePool();

// Función para obtener una conexión del pool con reintentos optimizados
const getConnection = async (retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      await poolConnect;
      return pool;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
    }
  }
};

// Función para obtener datos de la base de datos con caché
let cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const getDBData = async () => {
  try {
    const cacheKey = 'allData';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return { allData: cachedData.data };
    }

    const connection = await getConnection();
    const result = await connection.request()
      .query('SELECT * FROM dbo.Tabla_Vista_MS WITH (NOLOCK)');
    
    cache.set(cacheKey, {
      data: result.recordset,
      timestamp: Date.now()
    });

    return { allData: result.recordset };
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

// Función para limpiar la caché
const clearCache = () => {
  cache.clear();
};

// Función para obtener todos los registros de la base de datos
const readDB = async () => {
  try {
    const { allData } = await getDBData();
    const pendientes = allData.map((row, index) => ({
      id: index + 1,
      ...row
    }));
    return { pendientes };
  } catch (error) {
    console.error("Error al leer la base de datos:", error);
    throw error;
  }
};

// Función genérica para obtener datos por ID
/*const getDataById = async (id, fieldName) => {
  try {
    const cacheKey = `${fieldName}_${id}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return cachedData.data;
    }

    const connection = await getConnection();
    const request = connection.request();
    const query = `
      SELECT Conca_1, ${fieldName}
      FROM dbo.Tabla_Vista_MS WITH (NOLOCK)
      WHERE Conca_1 = @id
      OPTION (OPTIMIZE FOR UNKNOWN, MAXDOP 1, RECOMPILE)
    `;
    
    request.input('id', sql.NVarChar, id);
    const result = await request.query(query);
    
    if (!result.recordset || result.recordset.length === 0) {
      return null;
    }

    const item = result.recordset[0];
    const response = {
      conca1: item.Conca_1,
      [fieldName.toLowerCase()]: item[fieldName]
    };

    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return response;
  } catch (error) {
    console.error(`Error al obtener el ${fieldName.toLowerCase()} por ID:`, error);
    throw error;
  }
};
*/

// Función genérica para actualizar datos con invalidación de caché
const updateData = async (id, newValue, fieldName) => {
  try {
    const connection = await getConnection();
    const request = connection.request();
    
    const checkQuery = `
      SELECT Conca_1 
      FROM dbo.dbHistorica WITH (NOLOCK)
      WHERE Conca_1 = @id
    `;
    
    request.input('id', sql.NVarChar, id);
    const checkResult = await request.query(checkQuery);
    
    if (!checkResult.recordset || checkResult.recordset.length === 0) {
      throw new Error(`No se encontró ningún registro con el ID: ${id}`);
    }

    const updateQuery = `
      UPDATE dbo.dbHistorica 
      SET ${fieldName} = @newValue
      WHERE Conca_1 = @id
    `;
    
    request.input('newValue', sql.NVarChar, newValue);
    
    await request.query(updateQuery);
    clearCache();
    
    return {
      conca1: id,
      [fieldName.toLowerCase()]: newValue
    };
  } catch (error) {
    console.error(`Error al actualizar en Tabla_Vista_MS:`, error);
    throw error;
  }
};

// Función para obtener contratistas con caché
const getContractors = async () => {
  try {
    const cacheKey = 'contractors';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return cachedData.data;
    }

    const connection = await getConnection();
    const result = await connection.request()
      .query(`
        SELECT DISTINCT Contratista 
        FROM dbo.Tabla_Vista_MS WITH (NOLOCK)
        WHERE EMPRESA1 IS NOT NULL
        OPTION (OPTIMIZE FOR UNKNOWN)
      `);

    cache.set(cacheKey, {
      data: result.recordset,
      timestamp: Date.now()
    });

    return result.recordset;
  } catch (error) {
    console.error("Error al obtener las empresas contratistas:", error);
    throw error;
  }
};

// Función para obtener pendientes por contratista
const getPendingsByContractorDB = async (contratista) => {
  try {
      // Verificar caché
      const cacheKey = `pendientes_${contratista}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
          return cachedData.data;
      }

      const connection = await getConnection();
      const result = await connection.request()
          .input('contratista', sql.NVarChar, contratista)
          .query(`
              SELECT *
              FROM dbo.Tabla_Vista_MS WITH (NOLOCK)
              WHERE Contratista = @contratista
              OPTION (OPTIMIZE FOR UNKNOWN)
          `);

      if (!result.recordset || result.recordset.length === 0) {
          return null;
      }

      const pendientes = result.recordset.map((row, index) => ({
          id: index + 1,
          ...row
      }));

      // Guardar en caché
      cache.set(cacheKey, {
          data: pendientes,
          timestamp: Date.now()
      });

      return pendientes;
  } catch (error) {
      console.error("Error en getPendingsByContractorDB:", error);
      throw error;
  }
};

// Función para obtener un pendiente específico por su ID
const getPendingByIdDB = async (id) => {
  try {
      // Verificar caché
      const cacheKey = `pending_${id}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
          return cachedData.data;
      }

      const connection = await getConnection();
      const result = await connection.request()
          .input('id', sql.NVarChar, id)
          .query(`
              SELECT *
              FROM dbo.Tabla_Vista_MS WITH (NOLOCK)
              WHERE Conca_1 = @id
              OPTION (OPTIMIZE FOR UNKNOWN)
          `);

      if (!result.recordset || result.recordset.length === 0) {
          return null;
      }

      const pendiente = result.recordset[0];

      // Guardar en caché
      cache.set(cacheKey, {
          data: pendiente,
          timestamp: Date.now()
      });

      return pendiente;
  } catch (error) {
      console.error("Error en getPendingByIdDB:", error);
      throw error;
  }
};

// Manejar el cierre del pool cuando la aplicación se detenga
process.on('SIGINT', async () => {
  try {
    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error('Error al cerrar el pool de conexiones:', err);
    process.exit(1);
  }
});

export { 
  readDB,
  getContractors,
  clearCache,
  getConnection,
  getPendingsByContractorDB,
  getPendingByIdDB,
  updateData
};