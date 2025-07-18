
import { supabase } from '@/integrations/supabase/client';

export const setupRelatoriosStorage = async () => {
  try {
    // Verificar se o bucket já existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Erro ao listar buckets:', listError);
      return false;
    }

    const relatoriosBucket = buckets?.find(bucket => bucket.name === 'relatorios');
    
    if (!relatoriosBucket) {
      // Criar o bucket se não existir
      const { error: createError } = await supabase.storage.createBucket('relatorios', {
        public: false,
        allowedMimeTypes: ['application/xml', 'text/xml', 'application/vnd.ms-excel'],
        fileSizeLimit: 1024 * 1024 * 10 // 10MB
      });

      if (createError) {
        console.error('Erro ao criar bucket de relatórios:', createError);
        return false;
      }

      console.log('Bucket de relatórios criado com sucesso');
    }

    return true;
  } catch (error) {
    console.error('Erro ao configurar storage de relatórios:', error);
    return false;
  }
};
