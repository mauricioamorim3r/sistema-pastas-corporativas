const db = await getBrowserDatabase(); await db.deleteTemplate('PAPA-TERRA MEDIÇÃO'); await db.deleteTemplate('BOOK ANP'); console.log('Templates removidos para recreação');
