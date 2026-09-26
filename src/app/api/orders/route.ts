import { transporter, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email/mailer";
import {
  getOrderConfirmationHTML,
  getAdminOrderNotificationHTML,
} from "@/lib/email/templates";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

// GET — fetch logged-in user's orders
export async function GET() {
  try {
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: session.userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, image: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST — create new order
export async function POST(request: Request) {
  try {
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions
    );

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: "Please login to place an order" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      customerName,
      customerMobile,
      customerEmail,
      address,
      city,
      state,
      pincode,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
    } = body;

    // Validation
    if (
      !customerName ||
      !customerMobile ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !items ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId: session.userId as string,
          customerName: customerName.trim(),
          customerMobile: customerMobile.trim(),
          customerEmail: customerEmail?.trim() || null,
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          total: total,
          status: "PENDING",
          paymentMethod: paymentMethod,
          paymentStatus: paymentMethod === "cod" ? "PENDING" : "PAID",
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

// ===== SEND EMAILS =====
try {
  // Build order items with product names
  const orderItems = items.map((i: any) => {
    const matchedItem = order.items.find(
      (oi: any) => oi.productId === i.id
    );
    return {
      name: matchedItem?.product?.name || "Product",
      quantity: i.quantity,
      price: Number(i.price),
    };
  });

  // Customer confirmation email
  if (customerEmail) {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `✅ Order Confirmed - #${order.id
        .slice(-8)
        .toUpperCase()} - Amroha Pharmacy`,
      html: getOrderConfirmationHTML({
        customerName,
        orderId: order.id,
        items: orderItems,
        subtotal: Number(subtotal),
        deliveryFee: Number(deliveryFee),
        total: Number(total),
        address: `${address}, ${city}, ${state} - ${pincode}`,
        paymentMethod,
      }),
    });
  }

  // Admin notification email
  if (ADMIN_EMAIL) {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🔔 New Order #${order.id
        .slice(-8)
        .toUpperCase()} - ₹${total}`,
      html: getAdminOrderNotificationHTML({
        customerName,
        customerMobile,
        total: Number(total),
        paymentMethod,
        address: `${address}, ${city}, ${state} - ${pincode}`,
        orderId: order.id,
      }),
    });
  }
} catch (emailError) {
  // Email fail ho toh order fail nahi hona chahiye
  console.error("Email send error:", emailError);
}
// ===== END EMAILS =====

return NextResponse.json({ success: true, order });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
