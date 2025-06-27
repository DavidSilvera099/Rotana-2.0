import { getPendingByIdDB, updateData } from '../config/database.js';

// Obtener un pendiente por ID
export const getPendingById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'El ID es requerido'
            });
        }

        const pendiente = await getPendingByIdDB(id);

        if (!pendiente) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró el pendiente con el ID proporcionado'
            });
        }

        return res.status(200).json({
            success: true,
            data: pendiente
        });

    } catch (error) {
        console.error('Error en getPendingById:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el pendiente',
            error: error.message
        });
    }
};

// Actualizar un pendiente por ID
export const updatePending = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        if (!id || !updates || Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'ID y al menos un campo para actualizar son requeridos'
            });
        }

        const results = [];
        for (const [fieldName, newValue] of Object.entries(updates)) {
            try {
                const updatedData = await updateData(id, newValue, fieldName);
                results.push({
                    field: fieldName,
                    data: updatedData
                });
            } catch (error) {
                console.error(`Error actualizando campo ${fieldName}:`, error);
                results.push({
                    field: fieldName,
                    error: error.message
                });
            }
        }

        const hasErrors = results.some(result => result.error);
        
        return res.status(hasErrors ? 207 : 200).json({
            success: !hasErrors,
            message: hasErrors ? 'Algunas actualizaciones fallaron' : 'Pendiente actualizado exitosamente',
            results: results
        });

    } catch (error) {
        console.error('Error en updatePending:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar el pendiente',
            error: error.message
        });
    }
};
