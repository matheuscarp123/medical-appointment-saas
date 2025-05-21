import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LoadingProps {
  message?: string;
}

const LoadingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LoadingText = styled(Typography)`
  margin-top: 16px;
  color: #1976d2;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  letter-spacing: 1px;
`;

export const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...' }) => {
  return (
    <LoadingContainer>
      <CircularProgress size={48} thickness={4} />
      <LoadingText variant="h6">
        {message}
      </LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
