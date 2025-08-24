import os from "os";
import mongoose from "mongoose";
import SystemStat from "@/models/system.model"; // adjust path if needed

function formatUptime(seconds) {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export async function GET() {
  try {
    
    const dbOnline = mongoose.connection.readyState === 1;
    const dbHealth = dbOnline ? "Healthy" : "Down";

   
    const dbLoad = mongoose.connections.reduce(
      (acc, conn) => acc + (conn.readyState === 1 ? 1 : 0),
      0
    );

   
    const uptime = formatUptime(os.uptime());

   
    const stat = await SystemStat.create({
      dbOnline,
      dbHealth,
      dbLoad,
      uptime,
    });

    
    return new Response(JSON.stringify(stat), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching system stats:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch system stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
