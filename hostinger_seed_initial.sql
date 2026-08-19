-- Evan Medical Group booking platform: initial operational data.
-- Import this file after hostinger_schema.sql into the dedicated Hostinger database.
-- It contains branches, active services, and explicitly temporary doctor templates only.
-- It deliberately contains no patient records, bookings, conversations, or CRM events.

INSERT INTO `branches` (`id`, `slug`, `name`, `short_name`, `city`, `address`, `phone`, `is_active`) VALUES
  (1, 'mahdiyah', 'فرع حي المهدية', 'المهدية', 'الرياض — غرب الرياض', 'حي المهدية، غرب الرياض', '0112345678', true),
  (2, 'olaya', 'فرع حي العليا', 'العليا', 'الرياض — وسط الرياض', 'عماير السيركون، شارع موسى بن نصير، العليا', '0112345679', true),
  (3, 'ahmadiyah-laban', 'فرع حي الأحمدية — لبن', 'الأحمدية — لبن', 'الرياض — الأحمدية (لبن)', 'حي الأحمدية، لبن، غرب الرياض', '0112345680', true)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`), `short_name` = VALUES(`short_name`), `city` = VALUES(`city`),
  `address` = VALUES(`address`), `phone` = VALUES(`phone`), `is_active` = VALUES(`is_active`);

INSERT INTO `branch_specialties` (`branch_id`, `department`, `is_active`) VALUES
  (1, 'dentistry', true), (1, 'dermatology', true), (1, 'laser', true),
  (2, 'dentistry', true), (2, 'dermatology', true), (2, 'laser', true),
  (3, 'dentistry', true), (3, 'dermatology', true), (3, 'laser', true)
ON DUPLICATE KEY UPDATE `is_active` = VALUES(`is_active`);

INSERT INTO `services` (`id`, `name`, `description`, `duration`, `department`, `is_active`) VALUES
  (1, 'زراعة الأسنان', 'مسار حجز لخدمات زراعة الأسنان ضمن قسم الأسنان.', 60, 'dentistry', true),
  (2, 'تقويم الأسنان', 'مسار حجز لاستشارة تقويم الأسنان ضمن قسم الأسنان.', 60, 'dentistry', true),
  (3, 'ابتسامة هوليود', 'مسار حجز لخدمات ابتسامة هوليود ضمن قسم الأسنان.', 60, 'dentistry', true),
  (4, 'تركيبات الأسنان', 'مسار حجز لخدمات تركيبات الأسنان ضمن قسم الأسنان.', 60, 'dentistry', true),
  (5, 'خدمات أسنان أخرى', 'خيار لطلب خدمات أسنان أخرى وتحديد الاحتياج مع الفريق.', 45, 'dentistry', true)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`), `description` = VALUES(`description`), `duration` = VALUES(`duration`),
  `department` = VALUES(`department`), `is_active` = VALUES(`is_active`);

INSERT INTO `dentists` (`id`, `name`, `specialization`, `department`, `bio`, `phone`, `email`) VALUES
  (1, 'د. أحمد محمود', 'طب الأسنان العام', 'dentistry', 'قالب تجريبي بانتظار اعتماد بيانات الطبيب.', '0501234567', 'ahmed@dental.com'),
  (2, 'د. فاطمة السلام', 'تقويم الأسنان', 'dentistry', 'قالب تجريبي بانتظار اعتماد بيانات الطبيبة.', '0502345678', 'fatima@dental.com'),
  (3, 'د. محمد علي', 'جراحة الأسنان', 'dentistry', 'قالب تجريبي بانتظار اعتماد بيانات الطبيب.', '0503456789', 'mohammad@dental.com'),
  (4, 'د. نور الدين', 'تجميل الأسنان', 'dentistry', 'قالب تجريبي بانتظار اعتماد بيانات الطبيب.', '0504567890', 'noor@dental.com')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`), `specialization` = VALUES(`specialization`), `department` = VALUES(`department`),
  `bio` = VALUES(`bio`), `phone` = VALUES(`phone`), `email` = VALUES(`email`);

INSERT INTO `working_hours` (`dentist_id`, `day_of_week`, `start_time`, `end_time`, `is_active`) VALUES
  (1, 0, '09:00:00', '17:00:00', true), (1, 1, '09:00:00', '17:00:00', true), (1, 2, '09:00:00', '17:00:00', true), (1, 3, '09:00:00', '17:00:00', true), (1, 4, '09:00:00', '17:00:00', true),
  (2, 0, '10:00:00', '18:00:00', true), (2, 1, '10:00:00', '18:00:00', true), (2, 2, '10:00:00', '18:00:00', true), (2, 3, '10:00:00', '18:00:00', true), (2, 4, '10:00:00', '18:00:00', true),
  (3, 0, '08:00:00', '16:00:00', true), (3, 1, '08:00:00', '16:00:00', true), (3, 2, '08:00:00', '16:00:00', true), (3, 3, '08:00:00', '16:00:00', true), (3, 4, '08:00:00', '16:00:00', true),
  (4, 0, '11:00:00', '19:00:00', true), (4, 1, '11:00:00', '19:00:00', true), (4, 2, '11:00:00', '19:00:00', true), (4, 3, '11:00:00', '19:00:00', true), (4, 4, '11:00:00', '19:00:00', true);

ALTER TABLE `branches` AUTO_INCREMENT = 4;
ALTER TABLE `services` AUTO_INCREMENT = 6;
ALTER TABLE `dentists` AUTO_INCREMENT = 5;
