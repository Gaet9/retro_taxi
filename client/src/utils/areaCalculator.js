import * as turf from "@turf/turf";

/**
 * Calculate the area of a GeoJSON polygon or multipolygon
 * @param {Object} geojson - GeoJSON Polygon or MultiPolygon object
 * @returns {Object} Object containing area in square meters and square kilometers
 */
export const calculateArea = (geojson) => {
    try {
        if (!geojson || !geojson.type) {
            throw new Error("Invalid GeoJSON object");
        }

        // Calculate area in square meters
        const areaSqMeters = turf.area(geojson);

        // Convert to square kilometers
        const areaSqKm = areaSqMeters / 1_000_000;

        return {
            squareMeters: areaSqMeters,
            squareKilometers: areaSqKm,
            formatted: {
                sqM: areaSqMeters.toFixed(2),
                sqKm: areaSqKm.toFixed(2),
            },
        };
    } catch (error) {
        console.error("Error calculating area:", error);
        return {
            squareMeters: 0,
            squareKilometers: 0,
            formatted: {
                sqM: "0.00",
                sqKm: "0.00",
            },
        };
    }
};

/**
 * Format area for display in popup
 * @param {Object} areaData - Area data from calculateArea function
 * @returns {string} Formatted area string
 */
export const formatAreaForDisplay = (areaData) => {
    // Always display in square kilometers
    return `${areaData.formatted.sqKm} km²`;
};
