#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
import { Seeder } from './main.seed';

/**
 * Main execution function
 */
async function main() {
  try {
    const startTime = new Date();
    console.log(`⏱️ Seed started at: ${startTime.toLocaleString()}`);
    
    console.log('🔍 Creating seeder instance...');
    const seeder = new Seeder();
    
    console.log('🚀 Running seed process...');
    await seeder.seed();
    
    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;
    console.log(`⏱️ Seed completed at: ${endTime.toLocaleString()} (${duration.toFixed(2)}s)`);
    
    console.log('🎉 All done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}
