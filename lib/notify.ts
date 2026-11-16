// Tiny global notice bus: call notify() anywhere on the client and the
// <Notifier /> mounted in app/layout.tsx shows it. Replaces window.alert().
export type NoticeType = "error" | "success" | "info";

export type Notice = {
  id: number;
  message: string;
  type: NoticeType;
  duration: number; // ms
};

type Listener = (notice: Notice) => void;

const listeners = new Set<Listener>();
let nextId = 1;

export function notify(message: string, type: NoticeType = "error", duration = 4500) {
  const notice: Notice = { id: nextId++, message, type, duration };
  listeners.forEach((listener) => listener(notice));
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
