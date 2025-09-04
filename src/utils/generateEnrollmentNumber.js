
import { v4 as uuidv4 } from "uuid";

export async function generateEnrollmentNumber() {
  const year = new Date().getFullYear();
  // Take first 6 chars of UUID to keep it short and readable
  const uniquePart = uuidv4().split("-")[0].toUpperCase();  
  return `STU-${year}-${uniquePart}`;
}

