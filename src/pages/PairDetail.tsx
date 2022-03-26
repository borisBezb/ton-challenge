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
  Link,
  useParams,
} from 'react-router-dom';

import {
  Button,
  Card,
  CardContent,
  Skeleton,
  Typography,
  Box,
} from '@mui/material';
import PairAttribute from '../components/PairAttribute';
import PurchaseForm from '../components/PurchaseForm';

import { fetchPairDetail } from '../store/ton/slice';
import {
  AppDispatch,
  RootState,
} from '../store';

const DetailHeader: FC = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pb: 2 }}>
      {children}
    </Box>
  );
}

const PairDetail: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const params   = useParams();
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const { pair, status } = useSelector((state: RootState) => state.ton.detail)

  useEffect(() => {
    dispatch(fetchPairDetail(params.poolId as string));
  }, [dispatch]);

  const isLoaded = status === 'succeed';

  return (
    <>
      <Card sx={{ width: 600, overflow: 'auto' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            <Link to="/">Back to the list</Link>
          </Typography>
          {
            <div>
              <DetailHeader>
                <Typography variant="h5">
                  {
                    isLoaded
                      ? <>{pair!.meta.base}/{pair!.meta.counter}</>
                      : <Skeleton width={140}/>
                  }
                </Typography>

                <Typography fontSize="16px">
                  {
                    isLoaded
                      ? <>{pair!.leftPrice} {pair!.meta.counter}</>
                      : <Skeleton width={100}/>
                  }
                </Typography>
              </DetailHeader>

              <Box sx={{ display: 'flex', width: '100%', pb: 2, pt: 2 }}>
                <Box sx={{ flex: '0 0 50%' }}>
                  <PairAttribute label="Volume 24h" isLoaded={isLoaded}>
                    <>{isLoaded ? pair!.volumeChange24h : null}</>
                  </PairAttribute>

                  <PairAttribute label="Volume change 24h" isLoaded={isLoaded}>
                    <>{isLoaded ? pair!.volumeChange24h : null}</>
                  </PairAttribute>

                  <PairAttribute label="Volume 7d" isLoaded={isLoaded}>
                    <>{isLoaded ? pair!.volume7d : null}</>
                  </PairAttribute>
                </Box>

                <Box sx={{ flex: '0 0 50%'}}>
                  <PairAttribute label="Total Volume" isLoaded={isLoaded}>
                    <>{isLoaded ? pair!.tvl : null}</>
                  </PairAttribute>

                  <PairAttribute label="Total volume change" isLoaded={isLoaded}>
                    <>{isLoaded ? pair!.tvlChange : null}</>
                  </PairAttribute>
                </Box>
              </Box>

              {
                isLoaded
                  ? <Button variant="contained" fullWidth onClick={() => setFormOpen(true)}>
                    Purchase
                  </Button>
                  : <Skeleton height={48}/>
              }
            </div>
          }
        </CardContent>
      </Card>
      {
        formOpen &&
        <PurchaseForm onClose={() => setFormOpen(false)} pair={pair!}/>
      }
    </>
  );
}

export default PairDetail;
