import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { getToken } = await auth();
        const token = await getToken();
        // Await the params promise in Next.js 15
        const { id } = await context.params;
        const mentorId = id;

        const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentomania-api.agreeablemushroom-bc2495ec.centralindia.azurecontainerapps.io";

        const response = await fetch(`${backendUrl}/api/admin/mentor/${mentorId}/verify`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Admin API Verify Error:", error);
        return NextResponse.json({ success: false, msg: "Internal Server Error" }, { status: 500 });
    }
}
