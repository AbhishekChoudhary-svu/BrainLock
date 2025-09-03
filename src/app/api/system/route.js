import os from "os";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";          
import SystemStat from "@/models/system.model";   

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
   
    await dbConnect();

    const dbOnline = mongoose.connection.readyState === 1;
    const dbHealth = dbOnline ? "Healthy" : "Down";

    const dbLoad = mongoose.connections.reduce(
      (acc, conn) => acc + (conn.readyState === 1 ? 1 : 0),
      0
    );

    const uptime = formatUptime(os.uptime());

    const stat = await SystemStat.findOneAndUpdate(
      {},
      {
        dbOnline,
        dbHealth,
        dbLoad,
        uptime,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

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
