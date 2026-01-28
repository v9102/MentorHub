import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";

export async function POST(req: Request) {

    const payload = await req.text();

    const headerList = await headers();
    const svixId = headerList.get("svix-id");
    const svixTimestamp = headerList.get("svix-timestamp");
    const svixSignature = headerList.get("svix-signature");


    if (!svixId || !svixTimestamp || !svixSignature) {
        return new NextResponse("Missing Svix header", { status: 400 })
    }

    const webhooksecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhooksecret) {
        return new NextResponse("Missing Webhook secret", { status: 500 })
    }

    const wh = new Webhook(webhooksecret);

    let event: any;

    try {
        event = wh.verify(payload, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature
        })
    } catch (err) {
        console.log("Webhook signature verification failed", err)
        return new NextResponse("Invalid Signature", { status: 400 })
    }

    const { type, data } = event;

    if (!data.id) {
        console.error("Missing clerkId (data.id) in webhook payload");
        return new NextResponse("Missing clerkId", { status: 400 });
    }

    //Connect DB
    await connectDB();

    const email = data.email_addresses?.[0]?.email_address;

    try {
        if (type === "user.created") {
            if (!email) {
                console.error("Missing email in user.created webhook");
                return new NextResponse("Missing email", { status: 400 });
            }
            await User.create({
                clerkId: data.id,
                email: email,
                firstName: data.first_name,
                lastName: data.last_name,
                username: data.username,
                imageUrl: data.image_url,
                role: data.role,
                name: `${data.first_name ?? ""} ${data.last_name ?? ""}`,
            });
        }

        if (type === "user.updated") {
            await User.findOneAndUpdate(
                { clerkId: data.id },
                {
                    email: email,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    username: data.username,
                    imageUrl: data.image_url,
                    name: `${data.first_name ?? ""} ${data.last_name ?? ""}`,
                }
            );
        }
        if (type === "user.deleted") {
            await User.deleteOne({ clerkId: data.id });
        }
    } catch (dbErr: any) {
        console.error("Mongo error handling webhook:", dbErr);
        if (dbErr.code === 11000) {
            console.error("Duplicate key error:", dbErr.keyValue);
        }
        return new NextResponse(`DB error: ${dbErr.message}`, { status: 500 });
    }

    return NextResponse.json({ success: true })
}