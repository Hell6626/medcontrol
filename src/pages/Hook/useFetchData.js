// useFetchData.js
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const useFetchData = (fetchData) => {
  const [dataLoaded, setDataLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (!dataLoaded) { // Verifica se os dados ainda não foram carregados
          try {
            await fetchData();
            setDataLoaded(true); // Marca que os dados foram carregados
          } catch (error) {
            console.error("Erro ao carregar dados:", error);
          }
        }
      };

      loadData(); // Chama a função para carregar dados ao focar na tela

      return () => {
        // Se necessário, você pode limpar alguma coisa aqui
        // Por exemplo, você pode reiniciar dataLoaded se necessário
        // setDataLoaded(false); // Descomente se quiser que os dados sejam recarregados ao voltar
      };
    }, [fetchData, dataLoaded]) // Adiciona fetchData e dataLoaded às dependências
  );
};

export default useFetchData;
