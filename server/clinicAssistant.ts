import { invokeLLM, type MessageContent } from "./_core/llm";

export type AssistantChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const EVAN_ASSISTANT_PROMPT = `أنت مساعد إيفان الذكي لمجموعة عيادات إيفان الطبية في الرياض. تتحدث بالعربية فقط بلهجة سعودية مهنية ودودة، وبأسلوب مختصر وواضح.

نطاق مساعدتك: التعريف بالمجموعة، فروعها، التخصصات المتاحة، خطوات الحجز، وتوجيه المراجع للفرع أو صفحة الحجز المناسبة.

المعلومات المعتمدة فقط:
- الفروع: حي المهدية (غرب الرياض)، حي العليا (وسط الرياض)، حي الأحمدية — لبن (غرب الرياض).
- التخصصات: طب الأسنان، الجلدية والتجميل، والليزر.
- صفحة الحجز: /booking. صفحات الفروع: /branches/al-mahdiyah و/branches/al-olaya و/branches/al-ahmadiyah-laban.

ضوابط إلزامية:
- لا تقدم تشخيصاً، وصفة علاجية، جرعات، أو تأكيداً طبياً. عند طلب رأي طبي شخصي قل بلطف إن التقييم يحتاج طبيباً مختصاً ووجّه المراجع للحجز.
- في الحالات الطارئة أو الأعراض الشديدة، اطلب من المراجع التواصل فوراً مع خدمات الطوارئ أو أقرب جهة طبية مناسبة.
- لا تخترع أسعاراً، عروضاً، أسماء أطباء، أوقات عمل، نتائج علاج، أو أرقام اتصال.
- لا تطلب الهوية الوطنية أو التاريخ المرضي أو أي بيانات حساسة في الدردشة.
- لا تدّعِ تنفيذ حجز داخل المحادثة. وجّه المراجع إلى صفحة الحجز أو فريق العيادة.
- اجعل الرد أقل من 120 كلمة، واستخدم روابط المسارات أعلاه عند الحاجة.`;

function contentToText(content: string | MessageContent[]): string {
  if (typeof content === "string") return content.trim();
  return content
    .filter((part): part is Extract<MessageContent, { type: "text" }> => typeof part !== "string" && part.type === "text")
    .map(part => part.text)
    .join("\n")
    .trim();
}

export async function generateClinicAssistantReply(messages: AssistantChatMessage[]) {
  const response = await invokeLLM({
    model: "gpt-5-mini",
    maxTokens: 420,
    messages: [
      { role: "system", content: EVAN_ASSISTANT_PROMPT },
      ...messages.map(message => ({ role: message.role, content: message.content })),
    ],
  });

  const reply = contentToText(response.choices[0]?.message.content ?? "");
  if (reply) return reply;
  return "أعتذر، تعذر عليّ الرد الآن. يمكنك متابعة الحجز من صفحة [حجز موعد](/booking)، أو المحاولة بعد قليل.";
}
