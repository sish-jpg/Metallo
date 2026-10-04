import { Foundry } from '../models/Foundry.js';
import { TariffSettings } from '../models/TariffSettings.js';
import { Furnace } from '../models/Furnace.js';
import { validateAndImportHeatsCsv, getSampleCsvTemplate } from '../services/csvService.js';

export async function getSettings(req, res) {
  try {
    const foundry = await Foundry.findOne() || {};
    const tariffSettings = await TariffSettings.findOne() || {};
    const furnaces = await Furnace.find().exec();

    return res.json({
      success: true,
      foundry,
      tariffSettings,
      furnaces
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateSettings(req, res) {
  try {
    const { foundry: foundryUpdates, tariffSettings: tariffUpdates } = req.body;

    let updatedFoundry = null;
    let updatedTariff = null;

    if (foundryUpdates) {
      const existingFoundry = await Foundry.findOne();
      if (existingFoundry) {
        updatedFoundry = await Foundry.findByIdAndUpdate(existingFoundry._id, foundryUpdates, { new: true });
      } else {
        updatedFoundry = await Foundry.create(foundryUpdates);
      }
    }

    if (tariffUpdates) {
      const existingTariff = await TariffSettings.findOne();
      if (existingTariff) {
        updatedTariff = await TariffSettings.findByIdAndUpdate(existingTariff._id, tariffUpdates, { new: true });
      } else {
        updatedTariff = await TariffSettings.create(tariffUpdates);
      }
    }

    return res.json({
      success: true,
      message: 'Configuration saved successfully. All dynamic calculations updated.',
      foundry: updatedFoundry,
      tariffSettings: updatedTariff
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function handleCsvUpload(req, res) {
  try {
    let rows = [];

    // Support both multipart file upload and raw CSV body or JSON rows
    if (req.body?.rows && Array.isArray(req.body.rows)) {
      rows = req.body.rows;
    } else if (req.body?.csvText) {
      // Parse CSV text directly
      const lines = req.body.csvText.trim().split(/\r?\n/);
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim());
        rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = values[i];
          });
          return obj;
        });
      }
    } else if (req.file) {
      const content = req.file.buffer.toString('utf-8');
      const lines = content.trim().split(/\r?\n/);
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim());
        rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = values[i];
          });
          return obj;
        });
      }
    }

    const result = await validateAndImportHeatsCsv(rows);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getCsvTemplate(req, res) {
  const template = getSampleCsvTemplate();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="metallo_heats_template.csv"');
  return res.send(template);
}
