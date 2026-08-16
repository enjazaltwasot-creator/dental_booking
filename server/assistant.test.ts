import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ invokeLLM: vi.fn() }));
vi.mock("./_core/llm", () => ({ invokeLLM: mocks.invokeLLM }));

import { generateClinicAssistantReply } from "./clinicAssistant";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getAssistantMessages, getCrmSyncEvents, listAssistantConversations } from "./db";

function createPublicContext() {
  return {
    user: null,
    req: { protocol: "https", headers: {} },
    res: { cookie: () => {}, clearCookie: () => {} },
  } as unknown as TrpcContext;
}

describe("clinic assistant", () => {
  it("sends the institutional prompt and returns the assistant response", async () => {
    mocks.invokeLLM.mockResolvedValueOnce({
      choices: [{ message: { content: "هلا بك، تقدر تبدأ من صفحة الحجز." } }],
    });

    const reply = await generateClinicAssistantReply([
      { role: "user", content: "أبي أحجز في فرع العليا" },
    ]);

    expect(reply).toBe("هلا بك، تقدر تبدأ من صفحة الحجز.");
    expect(mocks.invokeLLM).toHaveBeenCalledWith(expect.objectContaining({
      model: "gpt-5-mini",
      messages: expect.arrayContaining([
        expect.objectContaining({ role: "system" }),
        { role: "user", content: "أبي أحجز في فرع العليا" },
      ]),
    }));
  });

  it("returns a booking fallback if the provider response has no text", async () => {
    mocks.invokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: "" } }] });

    const reply = await generateClinicAssistantReply([
      { role: "user", content: "أحتاج مساعدة" },
    ]);

    expect(reply).toContain("/booking");
  });

  it("records the latest user and assistant messages in a CRM-ready conversation", async () => {
    mocks.invokeLLM.mockResolvedValueOnce({
      choices: [{ message: { content: "هلا بك، تقدر تحجز من فرع العليا عبر صفحة الحجز." } }],
    });
    const sessionKey = `website-test-${Date.now()}-conversation`;
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.assistant.chat({
      sessionKey,
      messages: [{ role: "user", content: "أبي أحجز في العليا" }],
    });

    expect(result.reply).toContain("العليا");
    const conversation = (await listAssistantConversations(100)).find(item => item.sessionKey === sessionKey);
    expect(conversation).toBeDefined();
    const messages = await getAssistantMessages(conversation!.id);
    expect(messages.map(message => [message.role, message.content])).toEqual([
      ["user", "أبي أحجز في العليا"],
      ["assistant", result.reply],
    ]);
    const events = await getCrmSyncEvents(`assistant:${conversation!.id}`);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ eventType: "assistant_conversation", status: "pending" });
  });
});
