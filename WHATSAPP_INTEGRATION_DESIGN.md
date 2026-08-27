# تصميم تكامل WhatsApp لتأكيد استلام طلب الحجز

**حالة القالب:** القالب العربي `booking_request_received` من فئة Utility ظاهر كنشط في لقطة WhatsApp Manager التي وفرها مالك الموقع بتاريخ 2026-08-27.

## نطاق الإصدار الأول

يرسل الموقع رسالة واحدة فقط لتأكيد **استلام طلب الحجز** بعد نجاح حفظ طلب جديد وموافقة المراجع الصريحة على تلقي رسائل تتعلق بهذا الطلب. لا تشمل هذه المرحلة رسائل تذكير أو تسويق أو رسائل للحجوزات التاريخية.

## حمولة القالب

سيكون الاسم `booking_request_received`، مع تمرير متغيرات النص المسماة `customer_name` و`booking_reference` فقط. توضح Meta أن القوالب ذات المتغيرات تدعم تزويد القيم عند إرسال رسالة قالب عبر Cloud API، وأن بناء القالب ذي المتغيرات المسماة يرتبط باسم المتغير نفسه.[1]

ستتبع حمولة الإرسال صيغة Meta للقوالب ذات المتغيرات المسماة، وبذلك يحوي كل عنصر نص في `components[0].parameters` الحقول `type: "text"` و`parameter_name` و`text`. يمكن إرسال قيم المتغيرات المسماة بأي ترتيب، لكن الاسم يجب أن يطابق اسم المتغير المعتمد في القالب.[3]

## حارس الإرسال والأثر التشغيلي

يحفظ التطبيق حدث إرسال ثابتاً لكل طلب حجز وقالب، ثم يمنع إرسال نسخة أخرى عند وجود حدث ناجح أو قيد المعالجة. تحفظ النتيجة التقنية ومعرّف الرسالة الذي تعيده Meta، من دون حفظ محتوى الرسالة أو عرض رقم الهاتف كاملاً في السجل.

## متطلبات الويبهوك المؤجلة لمرحلة الاستلام والتسليم

عنوان الاستدعاء المستهدف هو `https://evanclinic.sa/api/whatsapp/webhook`. تتطلب Meta شهادة TLS/SSL صحيحة غير ذاتية التوقيع. وعند التحقق، تقارن الخدمة قيمة `hub.verify_token` في طلب GET بالقيمة المحفوظة في الخادم، ثم تعيد قيمة التحدي عندما تتطابق.[2]

سيحتاج تفعيل التحقق من توقيع طلبات POST إلى **App Secret** الخاص بتطبيق Meta، ولا يُفعّل استقبال الحالات قبل حفظه كسر بيئي مستقل.

## نتيجة اختبار الإرسال بتاريخ 2026-08-27

بعد موافقة المالك، نُفذت محاولة واحدة فقط لإرسال قالب الاختبار إلى الرقم الذي حدده. أعادت Meta استجابة `HTTP 400` بالرمز `133010`، ولم تُرسل الرسالة. يعرّف مرجع Meta هذا الرمز بأنه أن رقم الإرسال ليس مسجلاً بعد في WhatsApp Business Platform.[4]

المعالجة لا تتعلق بالقالب؛ فالقالب ظاهر كنشط. يجب أولاً إضافة رقم الأعمال في WhatsApp Manager والتحقق من ملكيته، ثم تسجيله عبر طلب `POST` إلى `PHONE_NUMBER_ID/register` يتضمن `messaging_product: "whatsapp"` ورمز تحقق ثنائي من ستة أرقام. التسجيل يتم عبر API فقط، وليس من WhatsApp Manager أو لوحة التطبيق.[5]

تؤكد لقطة «أرقام الهاتف» الواردة لاحقاً أن معرّف الإرسال `1101566993047104` مرتبط بالرقم التجاري الظاهر المنتهي بـ`1388` وباسم العرض «إيفان». وأظهرت لقطة لاحقة معرّفاً آخر للرقم المنتهي بـ`5935`، لكن المالك اختار صراحةً اعتماد البيانات الثانية، أي المعرّف `1101566993047104`، في تكامل الموقع.

تظهر لقطة ملخص حساب WhatsApp رقم أعمال إضافياً للمجموعة منتهياً بـ`5935` مع صفر رسائل مرسلة في الشهر. أكد المالك أن هذا هو الرقم الذي جرى اختباره أولاً. لا تُظهر شاشة الملخص معرّف رقم الهاتف الخاص بالـAPI، لذلك لا يُستخدم هذا الرقم كمرسل في التكامل إلا إذا اختاره المالك وزود معرّفه من قسم «أرقام الهاتف».

## المراجع

[1] [Meta for Developers — Template components](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/components/)

[2] [Meta for Developers — Create a webhook endpoint](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/create-webhook-endpoint/)

[3] [Meta for Developers — Template fundamentals](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview)

[4] [Meta for Developers — WhatsApp error codes](https://developers.facebook.com/documentation/business-messaging/whatsapp/support/error-codes)

[5] [Meta for Developers — Register a business phone number](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/registration)
