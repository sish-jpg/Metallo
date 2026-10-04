/**
 * METALLO Automated Test Suite Runner
 * Executes all domain unit and integration tests
 */

console.log('===========================================================');
console.log('       METALLO VERIFICATION & TEST SUITE RUNNER');
console.log('===========================================================\n');

try {
  await import('./calculations.test.js');
  await import('./scheduler.test.js');
  await import('./anomalyAndAlerts.test.js');
  await import('./csvAndSettings.test.js');

  console.log('===========================================================');
  console.log('  ALL TEST SUITES PASSED! 100% OF TESTED SPECS VERIFIED');
  console.log('===========================================================');
  process.exit(0);
} catch (err) {
  console.error('\n❌ TEST FAILURE OCCURRED:');
  console.error(err);
  process.exit(1);
}
