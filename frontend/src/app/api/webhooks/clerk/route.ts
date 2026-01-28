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

    //Connect DB
    await connectDB();

    try {
        if (type === "user.created") {
            await User.create({
                clerkId: data.id,
                email: data.email_addresses[0].email_address,
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
                    email: data.email_addresses[0].email_address,
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
    } catch (dbErr) {
        console.error("Mongo error handling webhook:", dbErr);
        return new NextResponse("DB error", { status: 500 });
    }

    return NextResponse.json({ success: true })
}