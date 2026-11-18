import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import protect from '../middleware/auth.js';
import {
  createHabit,
  deleteHabit,
  getHabit,
  getInsights,
  getStats,
  listHabits,
  listLogs,
  updateHabit,
  upsertLog
} from '../controllers/habitController.js';

const router = Router();
const validate = (req, res, next) => {
  const errors = validationResult(req);
  return errors.isEmpty() ? next() : res.status(400).json({ message: errors.array()[0].msg });
};
const habitFields = [
  body('name').optional().trim().notEmpty(),
  body('frequency').optional().isIn(['daily', 'weekly']),
  body('targetPerWeek').optional().isInt({ min: 1, max: 7 }).toInt(),
  body('scheduledTime').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/),
  body('reminderInterval').optional().isInt({ min: 5, max: 1440 }).toInt(),
  body('reminderLimit').optional().isInt({ min: 0, max: 20 }).toInt(),
  body('reminderEnabled').optional().isBoolean().toBoolean(),
  body('color').optional().isHexColor()
];
const logFields = [
  body('date').optional().matches(/^\d{4}-\d{2}-\d{2}$/),
  body('completed').optional().isBoolean().toBoolean()
];

router.use(protect);
router.get('/', listHabits);
router.get('/insights', getInsights);
router.post('/', [body('name').trim().notEmpty(), ...habitFields, validate], createHabit);
router.get('/:id', getHabit);
router.put('/:id', [...habitFields, validate], updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/logs', [...logFields, validate], upsertLog);
router.get('/:id/logs', listLogs);
router.get('/:id/stats', getStats);

export default router;