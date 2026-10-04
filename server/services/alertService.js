import { Alert } from '../models/Alert.js';

/**
 * Fetch alerts with optional filters
 */
export async function getAlerts(filters = {}) {
  const query = {};
  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;
  if (filters.furnaceId) query.furnaceId = filters.furnaceId;
  if (filters.resolved !== undefined) query.resolved = filters.resolved === 'true' || filters.resolved === true;
  if (filters.acknowledged !== undefined) query.acknowledged = filters.acknowledged === 'true' || filters.acknowledged === true;

  const alerts = await Alert.find(query).sort({ timestamp: -1 }).limit(100).exec();
  return alerts;
}

/**
 * Create an alert if a matching active (unresolved) alert does not already exist
 */
export async function createAlertIfNotExists(alertData) {
  const existing = await Alert.findOne({
    category: alertData.category,
    furnaceId: alertData.furnaceId || null,
    resolved: false
  });

  if (existing) {
    // Already active, update timestamp & observed value
    await Alert.findByIdAndUpdate(existing._id, {
      timestamp: new Date(),
      observedValue: alertData.observedValue,
      message: alertData.message
    });
    return existing;
  }

  const alertId = 'ALT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  const alert = await Alert.create({
    alertId,
    ...alertData,
    timestamp: new Date(),
    acknowledged: false,
    resolved: false
  });
  return alert;
}

/**
 * Mark alert as acknowledged
 */
export async function acknowledgeAlert(alertIdOrId) {
  const alert = await Alert.findOne({ $or: [{ alertId: alertIdOrId }, { _id: alertIdOrId }] });
  if (!alert) return null;
  return Alert.findByIdAndUpdate(alert._id, { acknowledged: true });
}

/**
 * Mark alert as resolved
 */
export async function resolveAlert(alertIdOrId) {
  const alert = await Alert.findOne({ $or: [{ alertId: alertIdOrId }, { _id: alertIdOrId }] });
  if (!alert) return null;
  return Alert.findByIdAndUpdate(alert._id, { resolved: true, acknowledged: true });
}
