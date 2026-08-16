import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ invokeLLM: vi.fn() }));
vi.mock("./_core/llm", () => ({ invokeLLM: mocks.invokeLLM }));

import { generateClinicAssistantReply } from "./clinicAssistant";

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
});
