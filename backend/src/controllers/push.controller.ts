import { eq } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import { pushSubscriptionTable } from "../db/schema.js";
import { sendNotification } from "../lib/web-push.js";
import {
  createPushSubscription,
  deletePushSubscription,
  sendBatchPushNotification,
  sendPushNotification,
} from "../routes/push.route.js";
import {
  CreatePushSubscriptionSchema,
  NotificationDataSchema,
  SubscriptionSchema,
} from "../zod/push.js";
import { createAuthRouter, createRouter } from "./router-factory.js";

export const pushRouter = createRouter();
export const pushProtectedRouter = createAuthRouter();

pushProtectedRouter.openapi(createPushSubscription, async (c) => {
  const { id } = c.req.param();
  const user = c.var.user;

  if (user.id !== id) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
        error: {},
      },
      400,
    );
  }

  try {
    const subscription = await db
      .select()
      .from(pushSubscriptionTable)
      .where(eq(pushSubscriptionTable.accountId, id))
      .limit(1);

    if (subscription.length === 0) {
      return c.json(
        {
          success: true,
          message: "Subscription not found",
          body: {
            isSubscribed: false,
          },
        },
        200,
      );
    }

    return c.json(
      {
        success: true,
        message: "Subscription retrieved successfully",
        body: {
          isSubscribed: true,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

pushProtectedRouter.openapi(createPushSubscription, async (c) => {
  const { id } = c.req.param();
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  if (user.id !== id) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
        error: {},
      },
      400,
    );
  }

  const zodParseResult = CreatePushSubscriptionSchema.parse(data);
  const { subscription } = zodParseResult;

  try {
    await db
      .insert(pushSubscriptionTable)
      .values({
        accountId: id,
        endpoint: subscription.endpoint,
        keys: JSON.stringify(subscription.keys),
      })
      .onConflictDoUpdate({
        target: [
          pushSubscriptionTable.accountId,
          pushSubscriptionTable.endpoint,
        ],
        set: {
          keys: JSON.stringify(subscription.keys),
        },
      });

    return c.json(
      {
        success: true,
        message: "Push subscription created successfully",
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

pushProtectedRouter.openapi(deletePushSubscription, async (c) => {
  const { id } = c.req.param();
  const user = c.var.user;

  if (user.id !== id) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
        error: {},
      },
      400,
    );
  }

  try {
    await db
      .delete(pushSubscriptionTable)
      .where(eq(pushSubscriptionTable.accountId, id));

    return c.json(
      {
        success: true,
        message: "Push subscription deleted successfully",
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

pushProtectedRouter.openapi(sendPushNotification, async (c) => {
  const { id } = c.req.param();
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  if (user.id !== id) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
        error: {},
      },
      400,
    );
  }

  const zodParseResult = NotificationDataSchema.parse(data);
  const { title, body: notificationBody, userId, actions } = zodParseResult;

  if (user.id === userId) {
    return c.json(
      {
        success: false,
        message: "Cannot send notification to self",
        error: {},
      },
      400,
    );
  }

  try {
    const subscription = await db
      .select()
      .from(pushSubscriptionTable)
      .where(eq(pushSubscriptionTable.accountId, userId))
      .limit(1);

    if (subscription.length === 0) {
      return c.json(
        {
          success: false,
          message: "Subscription not found",
          error: {},
        },
        400,
      );
    }

    const { endpoint, keys } = SubscriptionSchema.parse(subscription[0]);

    const pushSubscription = {
      endpoint,
      keys,
    };

    const notificationData = {
      title,
      body: notificationBody,
      actions,
    };

    await sendNotification(pushSubscription, notificationData);

    return c.json(
      {
        success: true,
        message: "Push notification sent successfully",
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});
