const pool = require("./dbconn.js");

// GET all zones (without coordinates for table display)
const get_all_zones = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id, 
                company, 
                city, 
                country,
                operational_model, 
                service_status, 
                fleet_size,
                coordinates,
                created_at,
                updated_at
            FROM zones 
            ORDER BY company, city
        `);

        // Parse coordinates if they're stored as text
        const zonesWithParsedCoords = result.rows.map((zone) => ({
            ...zone,
            coordinates: typeof zone.coordinates === "string" ? JSON.parse(zone.coordinates) : zone.coordinates,
        }));

        res.status(200).json({
            success: true,
            message: "All zones retrieved successfully",
            data: zonesWithParsedCoords,
        });
    } catch (err) {
        console.error("Error fetching zones:", err);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve zones",
            error: err.message,
        });
    }
};
// POST create new zone
const create_zone = async (req, res) => {
    try {
        const { company, city, country, operational_model, service_status, fleet_size, coordinates } = req.body;

        // Validate required fields
        if (!company || !coordinates) {
            return res.status(400).json({
                success: false,
                message: "Company and coordinates data are required",
            });
        }

        // Validate coordinates structure (if it's an object)
        if (typeof coordinates === "object") {
            if (!coordinates.type || !coordinates.geometry) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid coordinates format. Must include 'type' and 'geometry' properties",
                });
            }
        }

        const result = await pool.query(
            `
            INSERT INTO zones (
                company, 
                city, 
                country, 
                operational_model, 
                service_status, 
                fleet_size, 
                coordinates
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `,
            [
                company,
                city,
                country,
                operational_model || "Driverless (Geofenced L4)",
                service_status || "Testing",
                fleet_size,
                typeof coordinates === "string" ? coordinates : JSON.stringify(coordinates),
            ]
        );

        res.status(201).json({
            success: true,
            message: "Zone created successfully",
            data: result.rows[0],
        });
    } catch (err) {
        console.error("Error creating zone:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create zone",
            error: err.message,
        });
    }
};
// PUT update zone
const update_zone = async (req, res) => {
    try {
        const { id } = req.params;
        const { company, city, country, operational_model, service_status, fleet_size, coordinates } = req.body;

        // Build dynamic query based on provided fields
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (company) {
            updates.push(`company = $${paramCount++}`);
            values.push(company);
        }
        if (city) {
            updates.push(`city = $${paramCount++}`);
            values.push(city);
        }
        if (country) {
            updates.push(`country = $${paramCount++}`);
            values.push(country);
        }
        if (operational_model) {
            updates.push(`operational_model = $${paramCount++}`);
            values.push(operational_model);
        }
        if (service_status) {
            updates.push(`service_status = $${paramCount++}`);
            values.push(service_status);
        }
        if (fleet_size !== undefined) {
            updates.push(`fleet_size = $${paramCount++}`);
            values.push(fleet_size);
        }
        if (coordinates) {
            updates.push(`coordinates = $${paramCount++}`);
            values.push(typeof coordinates === "string" ? coordinates : JSON.stringify(coordinates));
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update",
            });
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const result = await pool.query(
            `
            UPDATE zones 
            SET ${updates.join(", ")}
            WHERE id = $${paramCount}
            RETURNING *
        `,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Zone not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Zone updated successfully",
            data: result.rows[0],
        });
    } catch (err) {
        console.error("Error updating zone:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update zone",
            error: err.message,
        });
    }
};
// DELETE zone
const delete_zone = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM zones 
            WHERE id = $1 
            RETURNING *
        `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Zone not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Zone deleted successfully",
            data: result.rows[0],
        });
    } catch (err) {
        console.error("Error deleting zone:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete zone",
            error: err.message,
        });
    }
};

module.exports = {
    get_all_zones,
    create_zone,
    update_zone,
    delete_zone,
};
