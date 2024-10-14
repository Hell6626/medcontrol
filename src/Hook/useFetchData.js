// useFetchData.js
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const useFetchData = (fetchData) => {
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          await fetchData();
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      };

      loadData(); // Chama a função para carregar dados ao focar na tela

      return () => {
        // Se necessário, você pode limpar alguma coisa aqui
      };
    }, [fetchData])
  );
};

export default useFetchData;
