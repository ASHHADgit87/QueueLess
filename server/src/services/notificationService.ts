import Notification, { NotificationType } from "../models/Notification";
import User from "../models/User";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface SendPushArgs {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, unknown>;
}
export const sendPushNotification = async ({
  userId,
  title,
  body,
  type,
  data,
}: SendPushArgs) => {
  await Notification.create({ user: userId, title, body, type });

  const user = await User.findById(userId).select("pushToken");
  if (!user?.pushToken) {
    return;
  }

  try {
    await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: user.pushToken,
        sound: "default",
        title,
        body,
        data: data ?? {},
      }),
    });
  } catch (err) {
    console.error("[Push] Failed to send push notification:", err);
  }
};

export const notifyYourTurn = (userId: string, queueName: string) =>
  sendPushNotification({
    userId,
    title: "It's your turn!",
    body: `You're being called now for ${queueName}. Please head over.`,
    type: "your_turn",
  });

export const notifyGetReady = (userId: string, queueName: string) =>
  sendPushNotification({
    userId,
    title: "Get ready!",
    body: `Only a couple of people are ahead of you in ${queueName}.`,
    type: "get_ready",
  });
