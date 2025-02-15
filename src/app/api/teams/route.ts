import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
    try {
        console.log("✅ API /api/teams was hit!");

        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log("✅ Connected to database!");

        // Ensure players are uniquely listed
        const [players]: any = await db.execute(`
            SELECT DISTINCT 
                players.id, 
                players.name, 
                players.last_name, 
                players.position, 
                players.age, 
                teams.name AS team_name
            FROM players
            LEFT JOIN team_players ON players.id = team_players.player_id
            LEFT JOIN teams ON team_players.team_id = teams.id
            ORDER BY players.last_name, players.name;
        `);

        //console.log("✅ Query Result:", JSON.stringify(players, null, 2));

        db.end();
        return NextResponse.json({ success: true, players });
    } catch (error: any) {
        console.error("❌ Database Error:", error);

        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
