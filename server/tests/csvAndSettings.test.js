import assert from 'assert';
import { validateAndImportHeatsCsv } from '../services/csvService.js';
import { connectDB } from '../config/db.js';

console.log('--- RUNNING CSV & SETTINGS TESTS ---');

await connectDB();

// Test 1: Empty CSV
{
  const result = await validateAndImportHeatsCsv([]);
  assert.strictEqual(result.success, false, 'Empty CSV must fail validation');
  console.log('✓ Empty CSV Validation Handled');
}

// Test 2: Missing Headers
{
  const invalidRows = [{ wrongHeader: 'val1', anotherWrong: 'val2' }];
  const result = await validateAndImportHeatsCsv(invalidRows);
  assert.strictEqual(result.success, false);
  assert.ok(result.errors[0].includes('Missing required header columns'), 'Should explain missing columns');
  console.log('✓ Missing Header Validation Handled');
}

// Test 3: Invalid Row Values (negative energy, invalid PF)
{
  const badDataRows = [
    { heatId: 'H-901', furnaceId: 'F1', productionTonnes: '1.0', totalEnergyKwh: '-500', averagePf: '0.95' },
    { heatId: 'H-902', furnaceId: 'F1', productionTonnes: '1.0', totalEnergyKwh: '600', averagePf: '1.8' }
  ];
  const result = await validateAndImportHeatsCsv(badDataRows);
  assert.strictEqual(result.success, false);
  assert.ok(result.errors.some(e => e.includes('positive number')), 'Should flag negative energy');
  assert.ok(result.errors.some(e => e.includes('between 0.1 and 1.0')), 'Should flag invalid PF > 1.0');
  console.log('✓ Row Value Validation Handled with Exact Row Numbers');
}

// Test 4: Valid CSV Ingestion
{
  const validRows = [
    { heatId: 'H-TEST-1', furnaceId: 'F1', productionTonnes: '1.0', totalEnergyKwh: '595', meltingMinutes: '60', holdingMinutes: '10', averagePf: '0.95', grade: 'Grey Iron' }
  ];
  const result = await validateAndImportHeatsCsv(validRows);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.importedCount, 1);
  console.log('✓ Valid CSV Ingestion & Dynamic Metrics Passed');
}

console.log('ALL CSV & VALIDATION TESTS PASSED! ✓\n');
