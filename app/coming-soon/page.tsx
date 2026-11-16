import PollNotice from "../components/PollNotice";
import { POLL_START_LABEL } from "@/lib/poll-window";

export default function ComingSoon() {
  return (
    <PollNotice>
      Тун удахгүй! Санал хураалт {POLL_START_LABEL} цагаас эхэлнэ.
    </PollNotice>
  );
}
