import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // @ts-ignore
        const { getToken } = await auth();
        const token = await getToken();
        const { id } = await params;
        const mentorId = id;

        const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8080";

        const response = await fetch(`${backendUrl}/api/admin/mentor/${mentorId}/reject`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Admin API Reject Error:", error);
        return NextResponse.json({ success: false, msg: "Internal Server Error" }, { status: 500 });
    }
}
