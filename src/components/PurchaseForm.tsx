import {
  FC,
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Zoom,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';

import { IPair } from '../store/ton/interfaces';
import {
  clearForm,
  purchasePair,
} from '../store/ton/slice';
import {
  AppDispatch,
  RootState,
} from '../store';

interface IPurchaseFormProps {
  onClose: () => void,
  pair: IPair
}

const amountRegExp = /^[0-9]*[.]?[0-9]*$/;

const PurchaseForm: FC<IPurchaseFormProps> = ({ onClose, pair }) => {
  const dispatch: AppDispatch = useDispatch();
  const { result, status } = useSelector((state: RootState) => state.ton.purchaseForm);

  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [amount, setAmount]       = useState<string>('1.0');

  useEffect(() => {
     setUnitPrice(Number(pair.leftPrice) / Number(pair.rightPrice));

     return () => {
       dispatch(clearForm());
     };
  }, [pair]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    await dispatch(purchasePair({
      pool: pair.meta.poolAddress,
      amount: Number(amount),
    }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (amountRegExp.test(e.target.value)) {
      setAmount(e.target.value)
    }
  };

  return (
    <Dialog open={true} onClose={handleClose} fullWidth>
      <DialogTitle>Purchase pair {pair.meta.base}/{pair.meta.counter}</DialogTitle>
      <DialogContent>
        {
          (status === 'succeed' || status === 'failed') &&
          <Zoom in={true}>
            <Alert severity={status === 'succeed' ? 'success' : 'error'} sx={{ mb: 2 }}>
              {result.message}
            </Alert>
          </Zoom>
        }
        <Box sx={{ pt: 2 }} >
          <TextField
            disabled={status === 'loading'}
            fullWidth
            name="amount"
            id="amount"
            label="Amount"
            value={amount}
            onChange={handleAmountChange}
            inputProps={{
              pattern: '^[0-9]*[.]?[0-9]*$',
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{pair.meta.base}</InputAdornment>,
            }}
          />
        </Box>
        <Box sx={{ pt: 2 }} >
          <TextField
            fullWidth
            disabled
            label="Total price"
            value={Number(amount) * unitPrice}
            InputProps={{
              endAdornment: <InputAdornment position="end">{pair.meta.counter}</InputAdornment>,
            }}
          />
        </Box>

        <Box sx={{ pt: 2 }} >
          <LoadingButton
            fullWidth
            loading={status === 'loading'}
            loadingPosition="start"
            variant="contained"
            onClick={handleSubmit}
            startIcon={<ShoppingCartIcon/>}
          >
            Purchase
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default PurchaseForm;
