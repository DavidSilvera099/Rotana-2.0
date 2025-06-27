import { readDB, getContractors, getPendingsByContractorDB } from '../config/database.js';

//Obtener todos los pendientes
export const getPendings = async (req, res) => {
    try {
        const data = await readDB();
        if (!data) {
            return res.status(404).json({ error: "No se encontraron datos en la base de datos" });
        }
        res.json(data.pendientes);
    } catch (error) {
        console.error("Error en getPendings:", error);
        res.status(500).json({ 
            error: "Error al obtener los pendientes",
            details: error.message 
        });
    }
};

//Obtener las contratistas de los pendientes
export const getPendingContractors = async (req, res) => {
    try {
        const contratistas = await getContractors();
        if (!contratistas || contratistas.length === 0) {
            return res.status(404).json({ error: "No se encontraron empresas contratistas" });
        }
        res.json(contratistas);
    } catch (error) {
        console.error("Error en getPendingContractors:", error);
        res.status(500).json({ 
            error: "Error al obtener las empresas contratistas",
            details: error.message 
        });
    }
};

//Obtener pendientes por contratista
export const getPendingsByContractor = async (req, res) => {
    try {
        const { contratista } = req.params;
        
        if (!contratista) {
            return res.status(400).json({ error: "El nombre de la contratista es requerido" });
        }

        const pendientes = await getPendingsByContractorDB(contratista);
        
        if (!pendientes) {
            return res.status(404).json({ 
                error: `No se encontraron pendientes para la contratista: ${contratista}` 
            });
        }

        res.json(pendientes);
    } catch (error) {
        console.error("Error en getPendingsByContractor:", error);
        res.status(500).json({ 
            error: "Error al obtener los pendientes por contratista",
            details: error.message 
        });
    }
};



