// 🔄 Script de Teste - Migração Segura localStorage → IndexedDB
// Este script demonstra como a migração funciona de forma segura

console.log('🔍 INICIANDO TESTE DE MIGRAÇÃO SEGURA\n');

async function testSafeMigration() {
  try {
    // 1. Importar o browserDatabase (dinâmico)
    const { getBrowserDatabase } = await import('./utils/browserDatabase.js');
    const db = await getBrowserDatabase();
    
    console.log('✅ IndexedDB inicializado com sucesso\n');

    // 2. Verificar status atual
    console.log('📊 VERIFICANDO STATUS ATUAL:');
    const status = await db.checkMigrationStatus();
    
    console.log(`   • Itens para migrar: ${status.itemsToMigrate}`);
    console.log(`   • Precisa migração: ${status.needsMigration ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`   • Tem backup: ${status.hasBackup ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`   • Migração completa: ${status.migrationComplete ? '✅ SIM' : '❌ NÃO'}`);
    
    if (status.errors.length > 0) {
      console.log(`   • Erros: ${status.errors.join(', ')}`);
    }
    console.log('');

    // 3. Se não precisar migrar, criar dados de teste
    if (!status.needsMigration) {
      console.log('🧪 CRIANDO DADOS DE TESTE NO localStorage:');
      
      // Simula dados que existiriam no localStorage
      const testData = {
        'favorite-folders': JSON.stringify([
          { id: 1, name: 'Pasta Favorita 1', color: '#3b82f6' },
          { id: 2, name: 'Pasta Favorita 2', color: '#ef4444' }
        ]),
        'color-settings': JSON.stringify({
          primaryColor: '#3b82f6',
          secondaryColor: '#ef4444',
          theme: 'corporate'
        }),
        'appTitle': 'Minha Empresa - Sistema de Pastas',
        'appLogo': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQi...'
      };

      for (const [key, value] of Object.entries(testData)) {
        localStorage.setItem(key, value);
        console.log(`   ✅ ${key}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
      }
      console.log('');

      // Verificar novamente após criar dados
      const newStatus = await db.checkMigrationStatus();
      console.log(`📊 NOVO STATUS: ${newStatus.itemsToMigrate} itens para migrar\n`);
    }

    // 4. TESTE 1: Criar backup
    console.log('💾 TESTE 1: CRIANDO BACKUP SEGURO...');
    const backupResult = await db.createSafeBackup();
    
    if (backupResult.success) {
      console.log(`   ✅ Backup criado com ID: ${backupResult.backupId}`);
    } else {
      console.log(`   ❌ Erro no backup: ${backupResult.error}`);
      return;
    }
    console.log('');

    // 5. TESTE 2: Migrar uma chave individual
    console.log('🔧 TESTE 2: MIGRAÇÃO INDIVIDUAL...');
    const testKey = 'color-settings';
    
    if (localStorage.getItem(testKey)) {
      console.log(`   🔄 Migrando chave: ${testKey}`);
      const keyResult = await db.migrateSingleKey(testKey);
      
      if (keyResult.success && keyResult.validated) {
        console.log(`   ✅ ${testKey} migrado e validado com sucesso`);
        
        // Testar recuperação
        const recoveredValue = await db.getMigratedValue(testKey);
        console.log(`   🔍 Valor recuperado: ${recoveredValue ? 'OK' : 'ERRO'}`);
      } else {
        console.log(`   ❌ Erro na migração: ${keyResult.error}`);
      }
    } else {
      console.log(`   ⚠️  Chave '${testKey}' não encontrada no localStorage`);
    }
    console.log('');

    // 6. TESTE 3: Migração completa
    console.log('🚀 TESTE 3: MIGRAÇÃO COMPLETA...');
    const migrationResult = await db.performSafeMigration();
    
    console.log(`   • Sucesso: ${migrationResult.success ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`   • Itens migrados: ${migrationResult.itemsMigrated}`);
    console.log(`   • Backup criado: ${migrationResult.backupCreated ? '✅ SIM' : '❌ NÃO'}`);
    
    if (migrationResult.errors.length > 0) {
      console.log(`   • Erros: ${migrationResult.errors.join(', ')}`);
    }
    console.log('');

    // 7. TESTE 4: Verificar dados migrados
    console.log('🔍 TESTE 4: VERIFICANDO DADOS MIGRADOS...');
    
    const migrationKeys = [
      'favorite-folders',
      'color-settings', 
      'appTitle',
      'appLogo'
    ];

    for (const key of migrationKeys) {
      const migratedValue = await db.getMigratedValue(key);
      const originalValue = localStorage.getItem(key);
      
      if (migratedValue) {
        const matches = migratedValue === originalValue;
        console.log(`   ${matches ? '✅' : '❌'} ${key}: ${matches ? 'OK' : 'DIFERENÇA DETECTADA'}`);
      } else {
        console.log(`   ⚠️  ${key}: Não encontrado no IndexedDB`);
      }
    }
    console.log('');

    // 8. TESTE 5: Salvar nova informação
    console.log('💾 TESTE 5: SALVANDO NOVA INFORMAÇÃO...');
    const saveResult = await db.saveMigratedValue('test-new-key', 'Valor de teste');
    console.log(`   ${saveResult ? '✅' : '❌'} Nova chave salva: ${saveResult ? 'SUCESSO' : 'ERRO'}`);
    console.log('');

    // 9. STATUS FINAL
    console.log('📊 STATUS FINAL:');
    const finalStatus = await db.checkMigrationStatus();
    console.log(`   • Migração completa: ${finalStatus.migrationComplete ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`   • Itens migrados: ${finalStatus.itemsToMigrate}`);
    console.log(`   • Tem backup: ${finalStatus.hasBackup ? '✅ SIM' : '❌ NÃO'}`);
    
    if (finalStatus.migrationComplete) {
      console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
      console.log('   📱 A aplicação agora usa IndexedDB ao invés de localStorage');
      console.log('   🛡️  Todos os dados foram preservados com segurança');
      console.log('   📦 Backup completo criado para segurança');
    }

  } catch (error) {
    console.error('❌ ERRO DURANTE O TESTE:', error);
    console.log('\n🔄 SUGESTÃO: Execute o rollback se necessário');
    console.log('   db.rollbackMigration()');
  }
}

// Executar teste apenas se estamos no navegador
if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined') {
  testSafeMigration();
} else {
  console.log('⚠️  Este teste deve ser executado no console do navegador');
  console.log('📋 Para testar:');
  console.log('   1. Abra a aplicação no navegador');
  console.log('   2. Pressione F12 para abrir o console');
  console.log('   3. Execute: await import("./test-indexeddb-migration.js")');
} 