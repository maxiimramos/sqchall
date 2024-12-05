import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;
const API_KEY = "RGAPI-415e49d0-2898-4128-b725-6de517d60950"; 
const REGION = "euw1"; 

app.use(cors());

// Ruta raíz para verificar que el servidor está activo
app.get("/", (req, res) => {
    res.send("Servidor funcionando. Usa las rutas de la API para obtener datos.");
});

// Ruta para obtener información de un invocador por nombre
app.get("/api/summoner/:name", async (req, res) => {
    const { name } = req.params;
    try {
        // Construir la URL con la región fija
        const response = await fetch(
            `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}?api_key=${API_KEY}`
        );
        const data = await response.json();

        // Log para depuración
        console.log("Respuesta de Riot API para Summoner:", data);

        // Verificar si hay error en la respuesta de Riot API
        if (data.status && data.status.status_code !== 200) {
            return res.status(data.status.status_code).json(data.status);
        }

        res.json(data);
    } catch (error) {
        console.error("Error al obtener datos del invocador:", error);
        res.status(500).json({ error: "Error al obtener datos del invocador" });
    }
});

// Ruta para obtener información de rango de un invocador por ID
app.get("/api/rank/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(
            `https://${REGION}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${API_KEY}`
        );
        const data = await response.json();

        // Log para depuración
        console.log("Respuesta de Riot API para Rank:", data);

        if (data.status && data.status.status_code !== 200) {
            return res.status(data.status.status_code).json(data.status);
        }

        res.json(data);
    } catch (error) {
        console.error("Error al obtener datos del rango:", error);
        res.status(500).json({ error: "Error al obtener datos del rango" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
