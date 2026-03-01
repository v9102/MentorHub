import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    try {
        const { getToken } = await auth();
        const token = await getToken();

        const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentomania-api.agreeablemushroom-bc2495ec.centralindia.azurecontainerapps.io";
        console.log("[Admin API] Fetching from:", `${backendUrl}/api/admin/mentor-applications`);

        const response = await fetch(`${backendUrl}/api/admin/mentor-applications`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("[Admin API] Backend returned status:", response.status);
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Admin API Error:", error);
        return NextResponse.json({ success: false, msg: "Internal Server Error" }, { status: 500 });
    }
}
