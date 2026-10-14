import { z } from 'zod';
import yamlConfig from '../../config/experiences.yaml';

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, '日期应使用 YYYY-MM');
const experienceSchema = z
  .object({
    startDate: month,
    endDate: z.union([month, z.literal('')]).optional(),
    organization: z.string().trim().min(1),
    role: z.string().trim().min(1),
    logo: z.string().startsWith('/img/').optional(),
    icon: z.string().trim().min(1).optional(),
    iconColor: z
      .string()
      .regex(/^#(?:[\da-f]{3}|[\da-f]{6})$/i, '图标颜色应使用十六进制色值')
      .optional(),
    description: z.string().trim().optional(),
  })
  .refine((item) => !item.endDate || item.endDate >= item.startDate, '结束时间不能早于开始时间');

export type Experience = z.infer<typeof experienceSchema>;

export const experiences = z
  .object({ experiences: z.array(experienceSchema) })
  .parse(yamlConfig)
  .experiences.sort((a, b) => b.startDate.localeCompare(a.startDate));
