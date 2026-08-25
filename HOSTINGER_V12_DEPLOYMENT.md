# نشر الإصدار v12 على Hostinger

هذا هو الإصدار الذي يحل محل **v11**. يجمع الحجز الديناميكي وSEO ومخرجات HTML القابلة للفهرسة وGTM وتحسين صور WebP وبنية المدونة التوعوية غير المفهرسة. لا ترفع أي حزمة أقدم بعده.

## خطوات الرفع

خذ نسخة احتياطية من قاعدة البيانات. إذا لم تستورد الترحيل من قبل، استورد `hostinger_dynamic_booking_upgrade.sql` مرة واحدة فقط في قاعدة `u694781553_evan_booking`. بعدها ارفع ملف ZIP الخاص بـv12 في **Web Apps**.

| الإعداد | القيمة |
|---|---|
| Node.js | 22 |
| أمر البناء | `npm install --omit=dev && npm run build` |
| نقطة التشغيل | `dist/index.js` |
| `NODE_ENV` | `production` |
| `CANONICAL_ORIGIN` | `https://evanclinic.sa` |

يحتوي المصدر على `.env.production` يضبط `VITE_ASSET_BASE=/assets`. لا تضع أي كلمات مرور أو مفاتيح سرية في ملف ZIP.

## تحقق بعد النشر

تحقق من `/booking` و`/robots.txt` و`/sitemap.xml` و`/llms.txt` و`/blog`. تظل المدونة ومسارات `/go/*` وصفحة الأطباء `noindex` عمداً إلى أن يعتمد المحتوى الطبي. راجع `HOSTINGER_SEO_CUTOVER.md` لإعداد 301 للنطاقات الفرعية وGTM، وراجع `DATA_APPROVAL_CHECKLIST.md` قبل تفعيل بيانات الاتصال أو ساعات العمل أو فهرسة المدونة.
