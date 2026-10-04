import { Alert } from '../models/Alert.js';
import { getAlerts, acknowledgeAlert, resolveAlert } from '../services/alertService.js';

export async function getAllAlerts(req, res) {
  try {
    const alerts = await getAlerts(req.query);
    const criticalCount = alerts.filter(a => a.type === 'CRITICAL' && !a.resolved).length;
    const warningCount = alerts.filter(a => a.type === 'WARNING' && !a.resolved).length;
    const infoCount = alerts.filter(a => a.type === 'INFO' && !a.resolved).length;

    return res.json({
      success: true,
      counts: {
        total: alerts.length,
        critical: criticalCount,
        warning: warningCount,
        info: infoCount,
        unresolved: criticalCount + warningCount + infoCount
      },
      alerts
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateAlertStatus(req, res) {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'acknowledge' | 'resolve'

    if (action === 'acknowledge') {
      const updated = await acknowledgeAlert(id);
      if (!updated) return res.status(404).json({ success: false, error: 'Alert not found' });
      return res.json({ success: true, alert: updated });
    } else if (action === 'resolve') {
      const updated = await resolveAlert(id);
      if (!updated) return res.status(404).json({ success: false, error: 'Alert not found' });
      return res.json({ success: true, alert: updated });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid action. Specify "acknowledge" or "resolve".' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
