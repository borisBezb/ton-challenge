import React, { FC } from 'react';
import {
  Box,
  Skeleton,
  Typography,
} from '@mui/material';

interface IPairAttributeProps {
  label: string;
  children: React.ReactElement;
  isLoaded: boolean;
}

const PairAttribute: FC<IPairAttributeProps> = ({ label, children, isLoaded }) => {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography color="text.secondary" component="div">
        {label}
      </Typography>
      <Typography component="div">
        {
          isLoaded
            ? <>{children}</>
            : <Skeleton width={100}/>
        }
      </Typography>
    </Box>
  );
}

export default PairAttribute;
