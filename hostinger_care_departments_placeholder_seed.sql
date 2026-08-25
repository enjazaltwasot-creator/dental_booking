-- Evan Medical Group: temporary dermatology and laser booking enablement.
-- Run ONCE after hostinger_dynamic_booking_upgrade.sql.
-- The names below are deliberately marked "قيد الاعتماد" and must be replaced
-- from the Admin Dashboard when the official doctors, services, and schedules are approved.

START TRANSACTION;

-- Ensure the declared departments remain enabled on all active branches.
UPDATE `branch_specialties` bs
JOIN `branches` b ON b.`id` = bs.`branch_id` AND b.`is_active` = true
SET bs.`is_active` = true
WHERE bs.`department` IN ('dermatology', 'laser');

-- Add temporary request services only if the same labelled service does not already exist.
INSERT INTO `services` (`name`, `description`, `duration`, `department`, `is_active`)
SELECT 'استشارة الجلدية والتجميل — قيد الاعتماد', 'خدمة مؤقتة لاستقبال طلبات الجلدية والتجميل إلى أن تُعتمد قائمة الخدمات النهائية.', 30, 'dermatology', true
WHERE NOT EXISTS (SELECT 1 FROM `services` WHERE `name` = 'استشارة الجلدية والتجميل — قيد الاعتماد');

INSERT INTO `services` (`name`, `description`, `duration`, `department`, `is_active`)
SELECT 'خدمة بروفايلو — قيد الاعتماد', 'خدمة مؤقتة مرتبطة بالخدمات المعلنة سابقاً، وتحتاج اعتماد قائمة التفاصيل النهائية.', 30, 'dermatology', true
WHERE NOT EXISTS (SELECT 1 FROM `services` WHERE `name` = 'خدمة بروفايلو — قيد الاعتماد');

INSERT INTO `services` (`name`, `description`, `duration`, `department`, `is_active`)
SELECT 'استشارة ليزر — قيد الاعتماد', 'خدمة مؤقتة لاستقبال طلبات الليزر إلى أن تُعتمد قائمة الخدمات النهائية.', 30, 'laser', true
WHERE NOT EXISTS (SELECT 1 FROM `services` WHERE `name` = 'استشارة ليزر — قيد الاعتماد');

INSERT INTO `services` (`name`, `description`, `duration`, `department`, `is_active`)
SELECT 'جلسة ليزر — قيد الاعتماد', 'خدمة مؤقتة للحجز المبدئي، وتُستبدل بالخدمة الرسمية ووقتها بعد الاعتماد.', 30, 'laser', true
WHERE NOT EXISTS (SELECT 1 FROM `services` WHERE `name` = 'جلسة ليزر — قيد الاعتماد');

-- These are not personal physician profiles. They are visibly labelled temporary teams.
INSERT INTO `dentists` (`name`, `specialization`, `department`, `bio`, `is_active`)
SELECT 'فريق الجلدية والتجميل — قيد الاعتماد', 'بيانات الفريق قيد الاعتماد', 'dermatology', 'سجل مؤقت لاستقبال طلبات الحجز، ويُستبدل ببيانات الطبيب الرسمية من لوحة الإدارة.', true
WHERE NOT EXISTS (SELECT 1 FROM `dentists` WHERE `name` = 'فريق الجلدية والتجميل — قيد الاعتماد');

INSERT INTO `dentists` (`name`, `specialization`, `department`, `bio`, `is_active`)
SELECT 'فريق الليزر — قيد الاعتماد', 'بيانات الفريق قيد الاعتماد', 'laser', 'سجل مؤقت لاستقبال طلبات الحجز، ويُستبدل ببيانات الطبيب الرسمية من لوحة الإدارة.', true
WHERE NOT EXISTS (SELECT 1 FROM `dentists` WHERE `name` = 'فريق الليزر — قيد الاعتماد');

-- Make both temporary teams available in every active branch.
INSERT IGNORE INTO `dentist_branches` (`dentist_id`, `branch_id`, `is_active`)
SELECT d.`id`, b.`id`, true
FROM `dentists` d
JOIN `branches` b ON b.`is_active` = true
WHERE d.`name` IN ('فريق الجلدية والتجميل — قيد الاعتماد', 'فريق الليزر — قيد الاعتماد');

-- Associate each temporary team only with services in its own care department.
INSERT IGNORE INTO `dentist_services` (`dentist_id`, `service_id`, `is_active`)
SELECT d.`id`, s.`id`, true
FROM `dentists` d
JOIN `services` s ON s.`department` = d.`department` AND s.`is_active` = true
WHERE d.`name` IN ('فريق الجلدية والتجميل — قيد الاعتماد', 'فريق الليزر — قيد الاعتماد');

-- Temporary availability: Sunday through Thursday, 10:00–18:00. Replace from Admin Dashboard when approved.
INSERT INTO `working_hours` (`dentist_id`, `day_of_week`, `start_time`, `end_time`, `is_active`)
SELECT d.`id`, schedule.`day_of_week`, '10:00:00', '18:00:00', true
FROM `dentists` d
JOIN (
  SELECT 0 AS `day_of_week` UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
) schedule
WHERE d.`name` IN ('فريق الجلدية والتجميل — قيد الاعتماد', 'فريق الليزر — قيد الاعتماد')
  AND NOT EXISTS (
    SELECT 1 FROM `working_hours` existing
    WHERE existing.`dentist_id` = d.`id`
      AND existing.`day_of_week` = schedule.`day_of_week`
      AND existing.`start_time` = '10:00:00'
      AND existing.`end_time` = '18:00:00'
  );

COMMIT;
