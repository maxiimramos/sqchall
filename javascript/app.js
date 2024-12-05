const players = [
    { name: "Rotuhardtai", opgg: "https://www.op.gg/summoners/euw/Rotuhardtai-5659" },
    { name: "Rotphbanis", opgg: "https://www.op.gg/summoners/euw/Rotphbanis-8240" },
    { name: "Sayhkalem", opgg: "https://www.op.gg/summoners/euw/Sayhkalem-5947" },
    { name: "Schsichehat", opgg: "https://www.op.gg/summoners/euw/Schsichehat-5539" },
    { name: "Ripzoless", opgg: "https://www.op.gg/summoners/euw/Ripzoless-7047" },
    { name: "Queqyzund", opgg: "https://www.op.gg/summoners/euw/Queqyzund-4459" },
    { name: "Quafkeltia", opgg: "https://www.op.gg/summoners/euw/Quafkeltia-6184" },
    { name: "Rynoerine", opgg: "https://www.op.gg/summoners/euw/Rynoerine-3488" },
    { name: "Polfnalris", opgg: "https://www.op.gg/summoners/euw/Polfnalris-9501" },
    { name: "Rhassulhon", opgg: "https://www.op.gg/summoners/euw/Rhassulhon-5445" },
];

// Función para obtener datos del jugador desde el servidor proxy
async function fetchPlayerData(player) {
    try {
        // Solicitar datos del jugador al servidor proxy
        const response = await fetch(`http://localhost:3000/api/summoner/${encodeURIComponent(player.name)}`);
        const data = await response.json();

        const summonerId = data.id;

        // Solicitar datos del rango del jugador
        const rankResponse = await fetch(`http://localhost:3000/api/rank/${summonerId}`);
        const rankData = await rankResponse.json();

        // Encontrar los datos del rango en cola clasificatoria soloQ
        const soloRank = rankData.find(entry => entry.queueType === "RANKED_SOLO_5x5");
        const rank = soloRank ? `${soloRank.tier} ${soloRank.rank}` : "Unranked";

        return rank;
    } catch (error) {
        console.error(`Error fetching data for ${player.name}:`, error);
        return "Error";
    }
}

// Función para actualizar la tabla de clasificación
async function updateTable() {
    const tableBody = document.getElementById("leaderboard-body");

    // Limpiar la tabla antes de actualizar
    tableBody.innerHTML = "";

    // Obtener los datos de los jugadores
    const playerData = await Promise.all(players.map(async (player) => {
        const rank = await fetchPlayerData(player);
        return { ...player, rank };
    }));

    // Ordenar los jugadores por rango
    playerData.sort((a, b) => {
        if (a.rank === "Unranked") return 1; // Poner "Unranked" al final
        if (b.rank === "Unranked") return -1;
        return b.rank.localeCompare(a.rank); // Ordenar por rango 
    });

    // Generar filas en la tabla
    playerData.forEach(player => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const rankCell = document.createElement("td");
        const opggCell = document.createElement("td");

        nameCell.textContent = player.name;
        rankCell.textContent = player.rank;
        opggCell.innerHTML = `<a href="${player.opgg}" target="_blank">Perfil</a>`;

        row.appendChild(nameCell);
        row.appendChild(rankCell);
        row.appendChild(opggCell);

        tableBody.appendChild(row);
    });
}

// Llamar a la función para actualizar la tabla al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    updateTable();
});
